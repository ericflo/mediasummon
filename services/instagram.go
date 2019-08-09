package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/pkg/browser"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/instagram"
	"golang.org/x/sync/semaphore"
	"maxint.co/mediasummon/config"
)

const instagramRequestSize = 100

type instagramService struct {
	serviceConfig *ServiceConfig
	conf          *oauth2.Config
	client        *http.Client
	accessToken   *oauth2.Token
	fetchSem      *semaphore.Weighted
	fetchErr      error
}

type instagramMedia struct {
	URL    string `json:"url"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type instagramDataItem struct {
	ID          string                     `json:"id"`
	CreatedTime string                     `json:"created_time"`
	Images      map[string]*instagramMedia `json:"images"`
	Videos      map[string]*instagramMedia `json:"videos"`
}

type instagramDataResponse struct {
	Data []*instagramDataItem `json:"data"`
}

// NewInstagramService creates a new service that can be used to sync with Instagram
func NewInstagramService(serviceConfig *ServiceConfig) (SyncService, error) {
	svc := &instagramService{
		serviceConfig: serviceConfig,
		fetchSem:      semaphore.NewWeighted(serviceConfig.NumFetchers),
	}
	if err := svc.Setup(); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service and checks for credentials, configuring an authed client if possible
func (svc *instagramService) Setup() error {
	if config.InstagramClientID == "" || config.InstagramClientSecret == "" {
		return fmt.Errorf("Found empty Instagram auth client id or client secret, check environment variables")
	}
	svc.conf = &oauth2.Config{
		ClientID:     config.InstagramClientID,
		ClientSecret: config.InstagramClientSecret,
		RedirectURL:  config.FrontendURL + "/auth/instagram/return",
		Endpoint:     instagram.Endpoint,
	}
	if tok, err := svc.loadAuthData(); err != nil {
		log.Println("Found no Instagram auth data to build client from: " + err.Error())
		svc.accessToken = nil
		svc.client = nil
	} else if tok != nil {
		svc.accessToken = tok
		svc.client = svc.conf.Client(oauth2.NoContext, tok)
	}
	applyMaxPagesHeuristic(svc, svc.serviceConfig)
	return nil
}

// NeedsCredentials reports whether credentials are needed for this user
func (svc *instagramService) NeedsCredentials() bool {
	return svc.client == nil || svc.accessToken == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *instagramService) CredentialRedirectURL() string {
	return svc.conf.AuthCodeURL("state")
}

func (svc *instagramService) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		displayErrorPage(w, "Could not parse Instagram's response")
		return
	}
	code := r.URL.Query().Get("code")
	if len(code) == 0 {
		displayErrorPage(w, "Invalid authentication code from Instagram")
		return
	}

	tok, err := svc.conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Instagram. "+err.Error())
		return
	}

	if err = svc.saveAuthData(tok); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	svc.accessToken = tok
	svc.client = svc.conf.Client(oauth2.NoContext, tok)

	w.Write([]byte("Connected! You can now close this browser window."))
}

func (svc *instagramService) Sync() error {
	// Wait until we have a client set up, requesting credentials if needed
	hasRequested := false
	for svc.NeedsCredentials() {
		if !hasRequested {
			if err := browser.OpenURL(svc.CredentialRedirectURL()); err != nil {
				fmt.Fprintf(os.Stderr, "Could not open browser: %v", err)
				return err
			}
			hasRequested = true
		}
		time.Sleep(time.Second)
	}

	maxID := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://api.instagram.com/v1/users/self/media/recent/?access_token=%s&count=%d", svc.accessToken.AccessToken, instagramRequestSize)
		if maxID == "" {
			return base
		}
		return base + "&max_id=" + maxID
	}

	for i := 1; i <= svc.serviceConfig.MaxPages; i++ {
		log.Println("Fetching Instagram directory page", i)
		// Fetch a page from Instagram
		resp, err := svc.client.Get(makeURL())
		if err != nil {
			log.Println("Error fetching Instagram directory page: " + err.Error())
			return err
		}
		defer resp.Body.Close()

		/*
			if r, err := ioutil.ReadAll(resp.Body); err != nil {
				return err
			} else {
				log.Println("Resp", string(r))
			}
		*/

		// Parse the response
		var data instagramDataResponse
		if err = json.NewDecoder(resp.Body).Decode(&data); err != nil {
			log.Println("Error decoding Instagram JSON response " + err.Error())
			return err
		}

		// Sync the individual media items in this page
		if err = svc.syncDataItems(data.Data); err != nil {
			log.Println("Error syncing Instagram data items: " + err.Error())
			return err
		}

		// Bail out of the loop under one condition: no media items
		if len(data.Data) == 0 {
			break
		}

		// Extract new max_id for the next round of the loop
		maxID = data.Data[len(data.Data)-1].ID
	}

	return nil
}

// syncMediaItems syncs a batch of media items
func (svc *instagramService) syncDataItems(items []*instagramDataItem) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for _, item := range items {
		video, videoExists := item.Videos["standard_resolution"]
		image, imageExists := item.Images["standard_resolution"]
		if videoExists {
			if err := svc.syncDataItemMedia(ctx, item, video); err != nil {
				return err
			}
		} else if imageExists {
			if err := svc.syncDataItemMedia(ctx, item, image); err != nil {
				return err
			}
		} else {
			log.Println("Could not find standard resolution video or image", item)
			continue
		}
	}

	if err := svc.fetchSem.Acquire(ctx, svc.serviceConfig.NumFetchers); err != nil {
		log.Printf("Failed to acquire semaphore after loop: %v", err)
		return err
	}
	svc.fetchSem.Release(svc.serviceConfig.NumFetchers)

	return svc.fetchErr
}

func (svc *instagramService) syncDataItemMedia(ctx context.Context, item *instagramDataItem, media *instagramMedia) error {
	parsedURL, err := url.Parse(media.URL)
	if err != nil {
		return err
	}
	ext := strings.ToLower(filepath.Ext(parsedURL.Path))
	if !strings.HasPrefix(ext, ".") {
		return fmt.Errorf("Could not parse extension: %s", parsedURL.Path)
	}
	createdTimestamp, err := strconv.ParseInt(item.CreatedTime, 10, 64)
	if err != nil {
		return fmt.Errorf("Could not parse created time into int64: %v", err)
	}
	createdTime := time.Unix(createdTimestamp, 0)
	formatted := createdTime.Format(svc.serviceConfig.Format)

	dir := filepath.Join(svc.serviceConfig.Directory, filepath.Dir(formatted))
	if err := os.MkdirAll(dir, 0644); err != nil {
		log.Println("Could not create directory ("+dir+"): ", err)
		return fmt.Errorf("Could not create directory (%s): %v", dir, err)
	}

	path := filepath.Join(dir, filepath.Base(formatted)+ext)
	info, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			if err := svc.fetchSem.Acquire(ctx, 1); err != nil {
				log.Printf("Failed to acquire semaphore during loop: %v", err)
				return err
			}
			go func(m *instagramMedia, p string) {
				defer svc.fetchSem.Release(1)
				if svc.fetchErr != nil {
					return
				}
				svc.fetchErr = downloadURLToPath(m.URL, p)
			}(media, path)
		} else {
			log.Println("Error calling stat on file: "+path, info, err)
			return err
		}
	}
	return nil
}

func (svc *instagramService) saveAuthData(tok *oauth2.Token) error {
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode Instagram authentication token to save: %v", err)
	}
	authdir := filepath.Join(svc.serviceConfig.Directory, ".meta", "instagram")
	if err = os.MkdirAll(authdir, 0644); err != nil {
		return fmt.Errorf("Could not create auth metadata directory: %v", err)
	}
	path := filepath.Join(authdir, "auth.json")
	if err = ioutil.WriteFile(path, encodedTok, 0644); err != nil {
		return fmt.Errorf("Could not write Instagram auth data to disk: %v", err)
	}
	return nil
}

func (svc *instagramService) loadAuthData() (*oauth2.Token, error) {
	path := filepath.Join(svc.serviceConfig.Directory, ".meta", "instagram", "auth.json")
	encodedTok, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var tok *oauth2.Token
	if err = json.Unmarshal(encodedTok, &tok); err != nil {
		return nil, err
	}
	return tok, nil
}

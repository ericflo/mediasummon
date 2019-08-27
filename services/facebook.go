package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pkg/browser"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/facebook"
	"golang.org/x/sync/semaphore"
	"gopkg.in/guregu/null.v3"
)

const facebookRequestSize = 100
const facebookTimestampFormat = "2006-01-02T15:04:05-0700"

type facebookService struct {
	serviceConfig *ServiceConfig
	conf          *oauth2.Config
	client        *http.Client
	accessToken   *oauth2.Token
	fetchSem      *semaphore.Weighted
	fetchErr      error
}

type facebookImage struct {
	Source string `json:"source"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type facebookDataItem struct {
	ID          string           `json:"id"`
	CreatedTime string           `json:"created_time"`
	Images      []*facebookImage `json:"images"`
}

type facebookPagingCursors struct {
	Before null.String `json:"before"`
	After  null.String `json:"after"`
}

type facebookPaging struct {
	Cursors *facebookPagingCursors `json:"cursors"`
	Next    null.String            `json:"next"`
}

type facebookDataResponse struct {
	Data   []*facebookDataItem `json:"data"`
	Paging *facebookPaging     `json:"paging"`
}

// NewFacebookService creates a new service that can be used to sync with Facebook
func NewFacebookService(serviceConfig *ServiceConfig) (SyncService, error) {
	svc := &facebookService{
		serviceConfig: serviceConfig,
		fetchSem:      semaphore.NewWeighted(serviceConfig.NumFetchers),
	}
	if err := svc.Setup(); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service and checks for credentials, configuring an authed client if possible
func (svc *facebookService) Setup() error {
	secret, ok := svc.serviceConfig.Secrets["facebook"]
	if !ok {
		return fmt.Errorf("Invalid setup detected: environment variables not loaded by the time Facebook setup ran")
	}
	clientID, cidOK := secret["ClientID"]
	clientSecret, csOK := secret["ClientSecret"]
	if !cidOK || !csOK || strings.TrimSpace(clientID) == "" || strings.TrimSpace(clientSecret) == "" {
		return fmt.Errorf("Found empty Facebook auth client id or client secret, check environment variables")
	}
	svc.conf = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  svc.serviceConfig.FrontendURL + "/auth/facebook/return",
		Scopes:       []string{"user_photos"},
		Endpoint:     facebook.Endpoint,
	}
	if tok, err := svc.loadAuthData(); err != nil {
		log.Println("Found no Facebook auth data to build client from: " + err.Error())
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
func (svc *facebookService) NeedsCredentials() bool {
	return svc.client == nil || svc.accessToken == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *facebookService) CredentialRedirectURL() string {
	return svc.conf.AuthCodeURL("state")
}

func (svc *facebookService) HTTPHandlers() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		"/auth/facebook/return": svc.HandleFacebookReturn,
	}
}

func (svc *facebookService) HandleFacebookReturn(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		displayErrorPage(w, "Could not parse Facebook's response")
		return
	}
	code := r.URL.Query().Get("code")
	if len(code) == 0 {
		displayErrorPage(w, "Invalid authentication code from Facebook")
		return
	}

	tok, err := svc.conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Facebook. "+err.Error())
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

func (svc *facebookService) Sync() error {
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

	nextURL := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://graph.facebook.com/v4.0/me/photos?type=uploaded&fields=id,created_time,images&limit=%d", facebookRequestSize)
		if nextURL == "" {
			return base
		}
		return nextURL
	}

	for i := 1; i <= svc.serviceConfig.MaxPages; i++ {
		log.Println("Fetching Facebook directory page", i)
		// Fetch a page from Facebook
		resp, err := svc.client.Get(makeURL())
		if err != nil {
			log.Println("Error fetching Facebook directory page: " + err.Error())
			return err
		}
		defer resp.Body.Close()

		// Parse the response
		var data facebookDataResponse
		if err = json.NewDecoder(resp.Body).Decode(&data); err != nil {
			log.Println("Error decoding Facebook JSON response " + err.Error())
			return err
		}

		// Sync the individual media items in this page
		if err = svc.syncDataItems(data.Data); err != nil {
			log.Println("Error syncing Facebook data items: " + err.Error())
			return err
		}

		// Bail out of the loop if either there's no paging block, or no next page indicated
		if data.Paging == nil || !data.Paging.Next.Valid {
			break
		}

		// Extract new beforeCursor for the next round of the loop
		nextURL = data.Paging.Next.String
	}

	return nil
}

func getMaxSizeImage(images []*facebookImage) *facebookImage {
	var currentMax *facebookImage
	var currentMaxSize = 0
	for _, image := range images {
		size := image.Width * image.Height
		if size > currentMaxSize {
			currentMax = image
			currentMaxSize = size
		}
	}
	return currentMax
}

// syncDataItems syncs a batch of facebookDataItem items
func (svc *facebookService) syncDataItems(items []*facebookDataItem) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for _, item := range items {
		image := getMaxSizeImage(item.Images)
		parsedURL, err := url.Parse(image.Source)
		if err != nil {
			return err
		}
		ext := strings.ToLower(filepath.Ext(parsedURL.Path))
		if !strings.HasPrefix(ext, ".") {
			return fmt.Errorf("Could not parse extension: %s", parsedURL.Path)
		}
		createdTimestamp, err := time.Parse(facebookTimestampFormat, item.CreatedTime)
		if err != nil {
			return fmt.Errorf("Could not parse created time into int64: %v", err)
		}
		formatted := createdTimestamp.Format(svc.serviceConfig.Format)

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
				go func(i *facebookImage, p string) {
					defer svc.fetchSem.Release(1)
					if svc.fetchErr != nil {
						return
					}
					svc.fetchErr = downloadURLToPath(i.Source, p)
				}(image, path)
			} else {
				log.Println("Error calling stat on file: "+path, info, err)
				return err
			}
		}
	}

	if err := svc.fetchSem.Acquire(ctx, svc.serviceConfig.NumFetchers); err != nil {
		log.Printf("Failed to acquire semaphore after loop: %v", err)
		return err
	}
	svc.fetchSem.Release(svc.serviceConfig.NumFetchers)

	return svc.fetchErr
}

func (svc *facebookService) saveAuthData(tok *oauth2.Token) error {
	return saveOAuthData(tok, svc.serviceConfig.Directory, "facebook")
}

func (svc *facebookService) loadAuthData() (*oauth2.Token, error) {
	return loadOAuthData(svc.serviceConfig.Directory, "facebook")
}

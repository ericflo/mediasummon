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
	"strconv"
	"strings"
	"time"

	"github.com/pkg/browser"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/instagram"
	"golang.org/x/sync/semaphore"
	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/storage"
)

const instagramRequestSize = 100

type instagramService struct {
	serviceConfig *ServiceConfig
	syncData      *ServiceSyncData
	storage       storage.Storage
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
		storage:       serviceConfig.Storage,
		fetchSem:      semaphore.NewWeighted(serviceConfig.NumFetchers),
	}
	if err := svc.Setup(); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service and checks for credentials, configuring an authed client if possible
func (svc *instagramService) Setup() error {
	secret, ok := svc.serviceConfig.Secrets["instagram"]
	if !ok {
		return fmt.Errorf("Invalid setup detected: environment variables not loaded by the time Instagram setup ran")
	}
	clientID, cidOK := secret["ClientID"]
	clientSecret, csOK := secret["ClientSecret"]
	if !cidOK || !csOK || strings.TrimSpace(clientID) == "" || strings.TrimSpace(clientSecret) == "" {
		return fmt.Errorf("Found empty Instagram auth client id or client secret, check environment variables")
	}
	svc.conf = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  svc.serviceConfig.FrontendURL + "/auth/instagram/return",
		Endpoint:     instagram.Endpoint,
	}
	if tok, err := loadOAuthData(svc.storage, "instagram"); err != nil {
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

func (svc *instagramService) Metadata() *ServiceMetadata {
	return &ServiceMetadata{
		ID:   "instagram",
		Name: "Instagram (Classic API)",
	}
}

func (svc *instagramService) CurrentSyncData() *ServiceSyncData {
	return svc.syncData
}

// NeedsCredentials reports whether credentials are needed for this user
func (svc *instagramService) NeedsCredentials() bool {
	return svc.client == nil || svc.accessToken == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *instagramService) CredentialRedirectURL() string {
	return svc.conf.AuthCodeURL("state")
}

func (svc *instagramService) HTTPHandlers() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		"/auth/instagram/return": svc.HandleInstagramReturn,
	}
}

func (svc *instagramService) HandleInstagramReturn(w http.ResponseWriter, r *http.Request) {
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

	if err = saveOAuthData(svc.storage, tok, "instagram"); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	svc.accessToken = tok
	svc.client = svc.conf.Client(oauth2.NoContext, tok)

	if svc.syncData == nil {
		go svc.Sync()
	}

	http.Redirect(w, r, "/", http.StatusFound)
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

	svc.syncData = &ServiceSyncData{
		Started: time.Now().UTC(),
		PageMax: null.IntFrom(int64(svc.serviceConfig.MaxPages)),
		Hashes:  map[string]string{},
	}
	if sdErr := persistSyncData(svc.storage, "instagram", svc.syncData); sdErr != nil {
		return sdErr
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
		svc.syncData.PageCurrent = null.IntFrom(int64(i))
		if sdErr := persistSyncData(svc.storage, "instagram", svc.syncData); sdErr != nil {
			return sdErr
		}

		log.Println("Fetching Instagram directory page", i)
		// Fetch a page from Instagram
		resp, err := svc.client.Get(makeURL())
		if err != nil {
			log.Println("Error fetching Instagram directory page: " + err.Error())
			return err
		}
		defer resp.Body.Close()

		// Parse the response
		var data instagramDataResponse
		if err = json.NewDecoder(resp.Body).Decode(&data); err != nil {
			log.Println("Error decoding Instagram JSON response " + err.Error())
			return err
		}

		// Increase the item count and persist
		svc.syncData.ItemCount = incrementOrSet(svc.syncData.ItemCount, len(data.Data))
		if sdErr := persistSyncData(svc.storage, "instagram", svc.syncData); sdErr != nil {
			return sdErr
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

	svc.syncData.Ended = null.TimeFrom(time.Now().UTC())
	if sdErr := persistSyncData(svc.storage, "instagram", svc.syncData); sdErr != nil {
		return sdErr
	}
	svc.syncData = nil

	return nil
}

// syncDataItems syncs a batch of instagramDataItem items
func (svc *instagramService) syncDataItems(items []*instagramDataItem) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for itemIdx, item := range items {
		video, videoExists := item.Videos["standard_resolution"]
		image, imageExists := item.Images["standard_resolution"]
		if videoExists {
			if err := svc.syncDataItemMedia(ctx, item, video); err != nil {
				handleSyncError(svc.storage, "instagram", svc.syncData, len(items)-itemIdx)
				return err
			}
		} else if imageExists {
			if err := svc.syncDataItemMedia(ctx, item, image); err != nil {
				handleSyncError(svc.storage, "instagram", svc.syncData, len(items)-itemIdx)
				return err
			}
		} else {
			log.Println("Could not find standard resolution video or image", item)
			handleSyncError(svc.storage, "instagram", svc.syncData, 1)
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

	filePath := filepath.Join(filepath.Dir(formatted), filepath.Base(formatted)+ext)
	if exists, err := svc.storage.Exists(filePath); err != nil {
		return err
	} else if exists {
		svc.syncData.SkipCount = incrementOrSet(svc.syncData.SkipCount, 1)
		if sdErr := persistSyncData(svc.storage, "instagram", svc.syncData); sdErr != nil {
			return sdErr
		}
	} else {
		if err := svc.fetchSem.Acquire(ctx, 1); err != nil {
			log.Printf("Failed to acquire semaphore during loop: %v", err)
			return err
		}
		go func(m *instagramMedia, p string) {
			defer svc.fetchSem.Release(1)
			if svc.fetchErr != nil {
				return
			}
			var hash string
			hash, svc.fetchErr = svc.storage.DownloadFromURL(m.URL, p)
			persistSyncDataPostFetch(svc.storage, "instagram", svc.syncData, svc.fetchErr, filePath, hash)
		}(media, filePath)
	}
	return nil
}

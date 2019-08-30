package services

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/pkg/browser"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/sync/semaphore"
	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/storage"
)

const googleRequestSize = 100

type googleService struct {
	serviceConfig *ServiceConfig
	syncData      *ServiceSyncData
	storage       storage.Storage
	conf          *oauth2.Config
	client        *http.Client
	fetchSem      *semaphore.Weighted
	fetchErr      error
}

type googlePhoto struct {
	CameraMake      null.String `json:"cameraMake"`
	CameraModel     null.String `json:"cameraModel"`
	FocalLength     null.Float  `json:"focalLength"`
	ApertureFNumber null.Float  `json:"apertureFNumber"`
	ISOEquivalent   null.Float  `json:"isoEquivalent"`
	ExposureTime    null.String `json:"exposureTime"`
}

type googleVideo struct {
	CameraMake  null.String `json:"cameraMake"`
	CameraModel null.String `json:"cameraModel"`
	FPS         null.Float  `json:"fps"`
	Status      interface{} `json:"status"`
}

type googleMediaMetadata struct {
	CreationTime null.Time    `json:"creationTime"`
	Width        null.String  `json:"width"`
	Height       null.String  `json:"height"`
	Photo        *googlePhoto `json:"photo"`
	Video        *googleVideo `json:"video"`
}

type googleContributorInfo struct {
}

type googleMediaItem struct {
	ID              string                 `json:"id"`
	Description     null.String            `json:"description"`
	ProductURL      string                 `json:"productUrl"`
	BaseURL         string                 `json:"baseUrl"`
	MimeType        null.String            `json:"mimeType"`
	Filename        null.String            `json:"filename"`
	MediaMetadata   *googleMediaMetadata   `json:"mediaMetadata"`
	ContributorInfo *googleContributorInfo `json:"contributorInfo"`
}

type googleMediaItemsResponse struct {
	MediaItems    []*googleMediaItem `json:"mediaItems"`
	NextPageToken null.String        `json:"nextPageToken"`
}

// NewGoogleService creates a new service that can be used to sync with Google Photos
func NewGoogleService(serviceConfig *ServiceConfig) (SyncService, error) {
	svc := &googleService{
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
func (svc *googleService) Setup() error {
	secret, ok := svc.serviceConfig.Secrets["google"]
	if !ok {
		return fmt.Errorf("Invalid setup detected: environment variables not loaded by the time Google setup ran")
	}
	clientID, cidOK := secret["ClientID"]
	clientSecret, csOK := secret["ClientSecret"]
	if !cidOK || !csOK || strings.TrimSpace(clientID) == "" || strings.TrimSpace(clientSecret) == "" {
		return fmt.Errorf("Found empty Google Photos auth client id or client secret, check environment variables")
	}
	svc.conf = &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  svc.serviceConfig.FrontendURL + "/auth/google/return",
		Scopes: []string{
			"https://www.googleapis.com/auth/photoslibrary.readonly",
		},
		Endpoint: google.Endpoint,
	}
	if tok, err := loadOAuthData(svc.storage, "google"); err != nil {
		log.Println("Found no Google Photos auth data to build client from: " + err.Error())
		svc.client = nil
	} else if tok != nil {
		svc.client = svc.conf.Client(oauth2.NoContext, tok)
	}
	applyMaxPagesHeuristic(svc, svc.serviceConfig)
	return nil
}

func (svc *googleService) Metadata() *ServiceMetadata {
	return &ServiceMetadata{
		ID:   "google",
		Name: "Google Photos",
	}
}

// NeedsCredentials reports whether credentials are needed for this user
func (svc *googleService) NeedsCredentials() bool {
	return svc.client == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *googleService) CredentialRedirectURL() string {
	return svc.conf.AuthCodeURL("state")
}

func (svc *googleService) HTTPHandlers() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		"/auth/google/return": svc.HandleGoogleReturn,
	}
}

func (svc *googleService) HandleGoogleReturn(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		displayErrorPage(w, "Could not parse Google's response")
		return
	}
	code := r.URL.Query().Get("code")
	if len(code) == 0 {
		displayErrorPage(w, "Invalid authentication code from Google")
		return
	}

	tok, err := svc.conf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Google. "+err.Error())
		return
	}

	if err = saveOAuthData(svc.storage, tok, "google"); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	svc.client = svc.conf.Client(oauth2.NoContext, tok)

	http.Redirect(w, r, "/", http.StatusFound)
}

func (svc *googleService) Sync() error {
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
	if sdErr := persistSyncData(svc.storage, "google", svc.syncData); sdErr != nil {
		return sdErr
	}

	pageToken := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=%d", googleRequestSize)
		if pageToken == "" {
			return base
		}
		return base + "&pageToken=" + pageToken
	}

	for i := 1; i <= svc.serviceConfig.MaxPages; i++ {
		svc.syncData.PageCurrent = null.IntFrom(int64(i))
		if sdErr := persistSyncData(svc.storage, "google", svc.syncData); sdErr != nil {
			return sdErr
		}

		log.Println("Fetching Google Photos library page", i)
		// Fetch a page from Google Photos
		resp, err := svc.client.Get(makeURL())
		if err != nil {
			log.Println("Error fetching Google Photos directory page: " + err.Error())
			return err
		}
		defer resp.Body.Close()

		// Parse the response
		var data googleMediaItemsResponse
		if err = json.NewDecoder(resp.Body).Decode(&data); err != nil {
			log.Println("Error decoding Google Photos JSON response " + err.Error())
			return err
		}

		// Increase the item count and persist
		svc.syncData.ItemCount = incrementOrSet(svc.syncData.ItemCount, len(data.MediaItems))
		if sdErr := persistSyncData(svc.storage, "google", svc.syncData); sdErr != nil {
			return sdErr
		}

		// Sync the individual media items in this page
		if err = svc.syncMediaItems(data.MediaItems); err != nil {
			log.Println("Error syncing Google Photos media items: " + err.Error())
			return err
		}

		// Extract page token for the next round of the loop
		pageToken = data.NextPageToken.ValueOrZero()

		// Bail out of the loop under one condition: no next page token
		if pageToken == "" {
			break
		}
	}

	svc.syncData.Ended = null.TimeFrom(time.Now().UTC())
	if sdErr := persistSyncData(svc.storage, "google", svc.syncData); sdErr != nil {
		return sdErr
	}
	svc.syncData = nil

	return nil
}

// syncMediaItems syncs a batch of media items
func (svc *googleService) syncMediaItems(items []*googleMediaItem) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for itemIdx, item := range items {
		ext := strings.ToLower(filepath.Ext(item.Filename.String))
		if !strings.HasPrefix(ext, ".") {
			log.Println("Could not parse filename extension: " + item.Filename.String)
			handleSyncError(svc.storage, "google", svc.syncData, len(items)-itemIdx)
			continue
		}
		if !item.MediaMetadata.CreationTime.Valid {
			log.Println("Didn't parse a valid CreationTime, can't determine filename.")
			handleSyncError(svc.storage, "google", svc.syncData, len(items)-itemIdx)
			continue
		}
		formatted := item.MediaMetadata.CreationTime.Time.Format(svc.serviceConfig.Format)

		filePath := filepath.Join(filepath.Dir(formatted), filepath.Base(formatted)+ext)
		if exists, err := svc.storage.Exists(filePath); err != nil {
			handleSyncError(svc.storage, "google", svc.syncData, len(items)-itemIdx)
			return err
		} else if exists {
			svc.syncData.SkipCount = incrementOrSet(svc.syncData.SkipCount, 1)
			if sdErr := persistSyncData(svc.storage, "google", svc.syncData); sdErr != nil {
				return sdErr
			}
		} else {
			if err := svc.fetchSem.Acquire(ctx, 1); err != nil {
				log.Printf("Failed to acquire semaphore during loop: %v", err)
				handleSyncError(svc.storage, "google", svc.syncData, len(items)-itemIdx)
				return err
			}
			go func(i *googleMediaItem, p string) {
				defer svc.fetchSem.Release(1)
				if svc.fetchErr != nil {
					return
				}
				url := i.BaseURL
				if strings.HasPrefix(i.MimeType.String, "video") {
					url += "=dv"
				} else {
					url += "=d"
				}
				var hash string
				hash, svc.fetchErr = svc.storage.DownloadFromURL(url, p)
				persistSyncDataPostFetch(svc.storage, "google", svc.syncData, svc.fetchErr, filePath, hash)
			}(item, filePath)
		}
	}

	if err := svc.fetchSem.Acquire(ctx, svc.serviceConfig.NumFetchers); err != nil {
		log.Printf("Failed to acquire semaphore after loop: %v", err)
		return err
	}
	svc.fetchSem.Release(svc.serviceConfig.NumFetchers)

	return svc.fetchErr
}

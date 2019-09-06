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
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

const googleRequestSize = 100

var googleScopes = []string{
	"https://www.googleapis.com/auth/photoslibrary.readonly",
}

type googleService struct {
	serviceConfig *ServiceConfig
	syncDatas     map[string]*ServiceSyncData
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
		syncDatas: map[string]*ServiceSyncData{},
	}
	if err := svc.Setup(serviceConfig); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service and checks for credentials, configuring an authed client if possible
func (svc *googleService) Setup(serviceConfig *ServiceConfig) error {
	svc.serviceConfig = serviceConfig
	svc.fetchSem = semaphore.NewWeighted(serviceConfig.NumFetchers)
	return nil
}

func (svc *googleService) Metadata() *ServiceMetadata {
	return &ServiceMetadata{
		ID:   "google",
		Name: "Google Photos",
	}
}

func (svc *googleService) AppCreateURL() string {
	return "https://console.cloud.google.com/apis/credentials/oauthclient"
}

func (svc *googleService) CurrentSyncData(userConfig *userconfig.UserConfig) *ServiceSyncData {
	if userConfig == nil {
		return nil
	}
	if svc.syncDatas == nil {
		return nil
	}
	resp, _ := svc.syncDatas[userConfig.Path]
	return resp
}

// NeedsCredentials reports whether credentials are needed for this user
func (svc *googleService) NeedsCredentials(userConfig *userconfig.UserConfig) bool {
	client, err := oAuth2Client(userConfig, "google", google.Endpoint, googleScopes)
	if err != nil {
		return true
	}
	return client == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *googleService) CredentialRedirectURL(userConfig *userconfig.UserConfig) (string, error) {
	oauthConf, err := oAuth2Conf(userConfig, "google", google.Endpoint, googleScopes)
	if err != nil {
		return "", err
	}
	return oauthConf.AuthCodeURL(userConfig.Path), nil
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

	configPath := r.URL.Query().Get("state")
	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		displayErrorPage(w, "Could not load user config: "+err.Error())
		return
	}

	oauthConf, err := oAuth2Conf(userConfig, "google", google.Endpoint, googleScopes)
	if err != nil {
		displayErrorPage(w, "Could not load auth conf: "+err.Error())
		return
	}

	tok, err := oauthConf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Google. "+err.Error())
		return
	}

	if err = saveOAuthData(userConfig, "google", tok); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	if svc.CurrentSyncData(userConfig) == nil {
		go svc.Sync(userConfig, constants.MaxAllowablePages)
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func (svc *googleService) Sync(userConfig *userconfig.UserConfig, maxPages int) error {
	if svc.CurrentSyncData(userConfig) != nil {
		log.Println("Warning: called Sync() while already syncing (could be due to error from previous run)")
	}

	store, err := storage.CachedStorage(userConfig)
	if err != nil {
		return err
	}

	syncData := &ServiceSyncData{
		UserConfigPath: userConfig.Path,
		Started:        time.Now().UTC(),
		PageMax:        maxPages,
		Hashes:         map[string]string{},
	}
	svc.syncDatas[userConfig.Path] = syncData
	if sdErr := persistSyncData(store, "google", syncData); sdErr != nil {
		return sdErr
	}

	// Wait until we have a client set up, requesting credentials if needed
	hasRequested := false
	for svc.NeedsCredentials(userConfig) {
		if maxPages == 0 {
			maxPages = constants.MaxAllowablePages
		}
		if !hasRequested {
			redir, err := svc.CredentialRedirectURL(userConfig)
			if err != nil {
				return err
			}
			if err := browser.OpenURL(redir); err != nil {
				fmt.Fprintf(os.Stderr, "Could not open browser: %v", err)
				return err
			}
			hasRequested = true
		}
		time.Sleep(time.Second)
	}

	if maxPages == 0 {
		maxPages = 1
	}

	client, err := oAuth2Client(userConfig, "google", google.Endpoint, googleScopes)
	if err != nil {
		return err
	}

	pageToken := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=%d", googleRequestSize)
		if pageToken == "" {
			return base
		}
		return base + "&pageToken=" + pageToken
	}

	for i := 1; i <= maxPages; i++ {
		syncData.PageCurrent = null.IntFrom(int64(i))
		if sdErr := persistSyncData(store, "google", syncData); sdErr != nil {
			return sdErr
		}

		log.Println("Fetching Google Photos library page", i)
		// Fetch a page from Google Photos
		resp, err := client.Get(makeURL())
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
		syncData.ItemCount = incrementOrSet(syncData.ItemCount, len(data.MediaItems))
		if sdErr := persistSyncData(store, "google", syncData); sdErr != nil {
			return sdErr
		}

		// Sync the individual media items in this page
		if err = svc.syncMediaItems(store, syncData, data.MediaItems, userConfig.Format); err != nil {
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

	syncData.Ended = null.TimeFrom(time.Now().UTC())
	if sdErr := persistSyncData(store, "google", syncData); sdErr != nil {
		return sdErr
	}
	delete(svc.syncDatas, userConfig.Path)

	return nil
}

// syncMediaItems syncs a batch of media items
func (svc *googleService) syncMediaItems(store storage.Storage, syncData *ServiceSyncData, items []*googleMediaItem, format string) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for itemIdx, item := range items {
		ext := strings.ToLower(filepath.Ext(item.Filename.String))
		if !strings.HasPrefix(ext, ".") {
			log.Println("Could not parse filename extension: " + item.Filename.String)
			handleSyncError(store, "google", syncData, len(items)-itemIdx)
			continue
		}
		if !item.MediaMetadata.CreationTime.Valid {
			log.Println("Didn't parse a valid CreationTime, can't determine filename.")
			handleSyncError(store, "google", syncData, len(items)-itemIdx)
			continue
		}
		formatted := item.MediaMetadata.CreationTime.Time.Format(format)

		filePath := filepath.Join(filepath.Dir(formatted), filepath.Base(formatted)+ext)
		if exists, err := store.Exists(filePath); err != nil {
			handleSyncError(store, "google", syncData, len(items)-itemIdx)
			return err
		} else if exists {
			syncData.SkipCount = incrementOrSet(syncData.SkipCount, 1)
			if sdErr := persistSyncData(store, "google", syncData); sdErr != nil {
				return sdErr
			}
		} else {
			if err := svc.fetchSem.Acquire(ctx, 1); err != nil {
				log.Printf("Failed to acquire semaphore during loop: %v", err)
				handleSyncError(store, "google", syncData, len(items)-itemIdx)
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
				hash, svc.fetchErr = store.DownloadFromURL(url, p)
				persistSyncDataPostFetch(store, "google", syncData, svc.fetchErr, filePath, hash)
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

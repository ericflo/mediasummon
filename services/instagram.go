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
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

const instagramRequestSize = 100

type instagramService struct {
	serviceConfig *ServiceConfig
	syncDatas     map[string]*ServiceSyncData
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
		syncDatas: map[string]*ServiceSyncData{},
	}
	if err := svc.Setup(serviceConfig); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service, concurrency limiting structs, and configures the service
func (svc *instagramService) Setup(serviceConfig *ServiceConfig) error {
	svc.serviceConfig = serviceConfig
	svc.fetchSem = semaphore.NewWeighted(serviceConfig.NumFetchers)
	return nil
}

func (svc *instagramService) Metadata() *ServiceMetadata {
	return &ServiceMetadata{
		ID:   "instagram",
		Name: "Instagram",
	}
}

func (svc *instagramService) AppCreateURL() string {
	return "https://www.instagram.com/developer/clients/register/"
}

func (svc *instagramService) CurrentSyncData(userConfig *userconfig.UserConfig) *ServiceSyncData {
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
func (svc *instagramService) NeedsCredentials(userConfig *userconfig.UserConfig) bool {
	client, err := oAuth2Client(userConfig, "instagram", instagram.Endpoint, nil)
	if err != nil {
		return true
	}
	return client == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *instagramService) CredentialRedirectURL(userConfig *userconfig.UserConfig) (string, error) {
	oauthConf, err := oAuth2Conf(userConfig, "instagram", instagram.Endpoint, nil)
	if err != nil {
		return "", err
	}
	return oauthConf.AuthCodeURL(userConfig.Path), nil
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

	configPath := r.URL.Query().Get("state")
	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		displayErrorPage(w, "Could not load user config: "+err.Error())
		return
	}

	oauthConf, err := oAuth2Conf(userConfig, "instagram", instagram.Endpoint, nil)
	if err != nil {
		displayErrorPage(w, "Could not load auth conf: "+err.Error())
		return
	}

	tok, err := oauthConf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Instagram. "+err.Error())
		return
	}

	if err = saveOAuthData(userConfig, "instagram", tok); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	if svc.CurrentSyncData(userConfig) == nil {
		go svc.Sync(userConfig, constants.MaxAllowablePages)
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func (svc *instagramService) Sync(userConfig *userconfig.UserConfig, maxPages int) error {
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
	if sdErr := persistSyncData(store, "instagram", syncData); sdErr != nil {
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

	tok, err := loadOAuthData(userConfig, "instagram")
	if err != nil {
		return err
	}
	client, err := oAuth2Client(userConfig, "instagram", instagram.Endpoint, nil)
	if err != nil {
		return err
	}

	maxID := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://api.instagram.com/v1/users/self/media/recent/?access_token=%s&count=%d", tok.AccessToken, instagramRequestSize)
		if maxID == "" {
			return base
		}
		return base + "&max_id=" + maxID
	}

	for i := 1; i <= maxPages; i++ {
		syncData.PageCurrent = null.IntFrom(int64(i))
		if sdErr := persistSyncData(store, "instagram", syncData); sdErr != nil {
			return sdErr
		}

		log.Println("Fetching Instagram directory page", i)
		// Fetch a page from Instagram
		resp, err := client.Get(makeURL())
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
		syncData.ItemCount = incrementOrSet(syncData.ItemCount, len(data.Data))
		if sdErr := persistSyncData(store, "instagram", syncData); sdErr != nil {
			return sdErr
		}

		// Sync the individual media items in this page
		if err = svc.syncDataItems(store, syncData, data.Data, userConfig.Format); err != nil {
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

	syncData.Ended = null.TimeFrom(time.Now().UTC())
	if sdErr := persistSyncData(store, "instagram", syncData); sdErr != nil {
		return sdErr
	}
	delete(svc.syncDatas, userConfig.Path)

	return nil
}

// syncDataItems syncs a batch of instagramDataItem items
func (svc *instagramService) syncDataItems(store storage.Storage, syncData *ServiceSyncData, items []*instagramDataItem, format string) error {
	svc.fetchErr = nil

	for itemIdx, item := range items {
		video, videoExists := item.Videos["standard_resolution"]
		image, imageExists := item.Images["standard_resolution"]
		if videoExists {
			if err := svc.syncDataItemMedia(store, syncData, item, video, format); err != nil {
				handleSyncError(store, "instagram", syncData, len(items)-itemIdx)
				return err
			}
		} else if imageExists {
			if err := svc.syncDataItemMedia(store, syncData, item, image, format); err != nil {
				handleSyncError(store, "instagram", syncData, len(items)-itemIdx)
				return err
			}
		} else {
			log.Println("Could not find standard resolution video or image", item)
			handleSyncError(store, "instagram", syncData, 1)
			continue
		}
	}

	if err := svc.fetchSem.Acquire(context.TODO(), svc.serviceConfig.NumFetchers); err != nil {
		log.Printf("Failed to acquire semaphore after loop: %v", err)
		return err
	}
	svc.fetchSem.Release(svc.serviceConfig.NumFetchers)

	return svc.fetchErr
}

func (svc *instagramService) syncDataItemMedia(store storage.Storage, syncData *ServiceSyncData, item *instagramDataItem, media *instagramMedia, format string) error {
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
	formatted := createdTime.Format(format)

	filePath := filepath.Join(filepath.Dir(formatted), filepath.Base(formatted)+ext)
	if exists, err := store.Exists(filePath); err != nil {
		return err
	} else if exists {
		syncData.SkipCount = incrementOrSet(syncData.SkipCount, 1)
		if sdErr := persistSyncData(store, "instagram", syncData); sdErr != nil {
			return sdErr
		}
	} else {
		if err := svc.fetchSem.Acquire(context.TODO(), 1); err != nil {
			log.Printf("Failed to acquire semaphore during loop: %v", err)
			return err
		}
		go func(m *instagramMedia, p string) {
			defer svc.fetchSem.Release(1)
			if svc.fetchErr != nil {
				return
			}
			var hash string
			hash, svc.fetchErr = store.DownloadFromURL(m.URL, p)
			persistSyncDataPostFetch(store, "instagram", syncData, svc.fetchErr, filePath, hash)
		}(media, filePath)
	}
	return nil
}

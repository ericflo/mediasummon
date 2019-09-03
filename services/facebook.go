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
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

const facebookRequestSize = 100
const facebookTimestampFormat = "2006-01-02T15:04:05-0700"

var facebookScopes = []string{"user_photos"}

type facebookService struct {
	serviceConfig *ServiceConfig
	syncDatas     map[string]*ServiceSyncData
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
		syncDatas: map[string]*ServiceSyncData{},
	}
	if err := svc.Setup(serviceConfig); err != nil {
		return nil, err
	}
	return svc, nil
}

// Setup sets up the service and checks for credentials, configuring an authed client if possible
func (svc *facebookService) Setup(serviceConfig *ServiceConfig) error {
	svc.serviceConfig = serviceConfig
	svc.fetchSem = semaphore.NewWeighted(serviceConfig.NumFetchers)
	return nil
}

func (svc *facebookService) Metadata() *ServiceMetadata {
	return &ServiceMetadata{
		ID:   "facebook",
		Name: "Facebook Photos",
	}
}

func (svc *facebookService) CurrentSyncData(userConfig *userconfig.UserConfig) *ServiceSyncData {
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
func (svc *facebookService) NeedsCredentials(userConfig *userconfig.UserConfig) bool {
	client, err := oAuth2Client(userConfig, "facebook", facebook.Endpoint, facebookScopes)
	if err != nil {
		return true
	}
	return client == nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (svc *facebookService) CredentialRedirectURL(userConfig *userconfig.UserConfig) (string, error) {
	oauthConf, err := oAuth2Conf(userConfig, "facebook", facebook.Endpoint, facebookScopes)
	if err != nil {
		return "", err
	}
	return oauthConf.AuthCodeURL(userConfig.Path), nil
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

	configPath := r.URL.Query().Get("state")
	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		displayErrorPage(w, "Could not load user config: "+err.Error())
		return
	}

	oauthConf, err := oAuth2Conf(userConfig, "facebook", facebook.Endpoint, facebookScopes)
	if err != nil {
		displayErrorPage(w, "Could not load auth conf: "+err.Error())
		return
	}

	tok, err := oauthConf.Exchange(oauth2.NoContext, code)
	if err != nil {
		displayErrorPage(w, "Could not complete token exchange with Facebook. "+err.Error())
		return
	}

	if err = saveOAuthData(userConfig, "facebook", tok); err != nil {
		displayErrorPage(w, err.Error())
		return
	}

	if svc.CurrentSyncData(userConfig) == nil {
		go svc.Sync(userConfig, constants.MaxAllowablePages)
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func (svc *facebookService) Sync(userConfig *userconfig.UserConfig, maxPages int) error {
	if svc.CurrentSyncData(userConfig) != nil {
		log.Println("Warning: called Sync() while already syncing")
	}

	store, err := userConfig.GetMultiStore()
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
	if sdErr := persistSyncData(store, "facebook", syncData); sdErr != nil {
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

	client, err := oAuth2Client(userConfig, "facebook", facebook.Endpoint, facebookScopes)
	if err != nil {
		return err
	}

	nextURL := ""
	makeURL := func() string {
		base := fmt.Sprintf("https://graph.facebook.com/v4.0/me/photos?type=uploaded&fields=id,created_time,images&limit=%d", facebookRequestSize)
		if nextURL == "" {
			return base
		}
		return nextURL
	}

	for i := 1; i <= maxPages; i++ {
		syncData.PageCurrent = null.IntFrom(int64(i))
		if sdErr := persistSyncData(store, "facebook", syncData); sdErr != nil {
			return sdErr
		}

		log.Println("Fetching Facebook directory page", i)
		// Fetch a page from Facebook
		resp, err := client.Get(makeURL())
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

		// Increase the item count and persist
		syncData.ItemCount = incrementOrSet(syncData.ItemCount, len(data.Data))
		if sdErr := persistSyncData(store, "facebook", syncData); sdErr != nil {
			return sdErr
		}

		// Sync the individual media items in this page
		if err = svc.syncDataItems(store, syncData, data.Data, userConfig.Format); err != nil {
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

	syncData.Ended = null.TimeFrom(time.Now().UTC())
	if sdErr := persistSyncData(store, "facebook", syncData); sdErr != nil {
		return sdErr
	}
	delete(svc.syncDatas, userConfig.Path)

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
func (svc *facebookService) syncDataItems(store storage.Storage, syncData *ServiceSyncData, items []*facebookDataItem, format string) error {
	ctx := context.TODO()

	svc.fetchErr = nil

	for itemIdx, item := range items {
		image := getMaxSizeImage(item.Images)
		parsedURL, err := url.Parse(image.Source)
		if err != nil {
			handleSyncError(store, "facebook", syncData, len(items)-itemIdx)
			return err
		}
		ext := strings.ToLower(filepath.Ext(parsedURL.Path))
		if !strings.HasPrefix(ext, ".") {
			handleSyncError(store, "facebook", syncData, len(items)-itemIdx)
			return fmt.Errorf("Could not parse extension: %s", parsedURL.Path)
		}
		createdTimestamp, err := time.Parse(facebookTimestampFormat, item.CreatedTime)
		if err != nil {
			handleSyncError(store, "facebook", syncData, len(items)-itemIdx)
			return fmt.Errorf("Could not parse created time into int64: %v", err)
		}
		formatted := createdTimestamp.Format(format)

		filePath := filepath.Join(filepath.Dir(formatted), filepath.Base(formatted)+ext)
		if exists, err := store.Exists(filePath); err != nil {
			handleSyncError(store, "facebook", syncData, len(items)-itemIdx)
			return err
		} else if exists {
			syncData.SkipCount = incrementOrSet(syncData.SkipCount, 1)
			if sdErr := persistSyncData(store, "facebook", syncData); sdErr != nil {
				return sdErr
			}
		} else {
			if err := svc.fetchSem.Acquire(ctx, 1); err != nil {
				log.Printf("Failed to acquire semaphore during loop: %v", err)
				handleSyncError(store, "facebook", syncData, len(items)-itemIdx)
				return err
			}
			go func(i *facebookImage, p string) {
				defer svc.fetchSem.Release(1)
				if svc.fetchErr != nil {
					return
				}
				var hash string
				hash, svc.fetchErr = store.DownloadFromURL(i.Source, p)
				persistSyncDataPostFetch(store, "facebook", syncData, svc.fetchErr, filePath, hash)
			}(image, filePath)
		}
	}

	if err := svc.fetchSem.Acquire(ctx, svc.serviceConfig.NumFetchers); err != nil {
		log.Printf("Failed to acquire semaphore after loop: %v", err)
		return err
	}
	svc.fetchSem.Release(svc.serviceConfig.NumFetchers)

	return svc.fetchErr
}

package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/storage"
)

const maxAllowablePages = 1000000

// DefaultDirectory is the default target directory to download all media into
const DefaultDirectory = "media"

// DefaultAdminPath is the default path to the admin website
const DefaultAdminPath = "admin"

// DefaultFormat is the default format string specifying how to organize your media
var DefaultFormat = strings.ReplaceAll("2006/January/02-15_04_05", "/", string(os.PathSeparator))

// DefaultNumFetchers is the default maximum number of concurrent downloads each service can make
const DefaultNumFetchers = 6

// DefaultMaxPages is the default max number of pages of archive history to fetch, with 0 being auto
const DefaultMaxPages = 0

// DefaultWebPort is the default web port for the admin http server
const DefaultWebPort = "5000"

// ServiceMetadata is metadata that a service provides about itself
type ServiceMetadata struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

/*
// ServiceSystemData is metadata about a service that the system provides
type ServiceSystemData struct {
	LastSync  null.Time `json:"last_sync"`
	SyncCount int       `json:"sync_count"`
	ItemCount int       `json:"item_count"`
	FailCount int       `json:"fail_count"`
}
*/

// ServiceSyncData is data about a single sync session performed by a service
type ServiceSyncData struct {
	Started     time.Time         `json:"start"`
	Ended       null.Time         `json:"end"`
	PageCurrent null.Int          `json:"page_current"`
	PageMax     null.Int          `json:"page_max"`
	ItemCount   null.Int          `json:"item_count"`
	SkipCount   null.Int          `json:"skip_count"`
	FailCount   null.Int          `json:"fail_count"`
	FetchCount  null.Int          `json:"fetch_count"`
	Hashes      map[string]string `json:"hashes"`
}

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup() error
	Metadata() *ServiceMetadata
	NeedsCredentials() bool
	CredentialRedirectURL() string
	Sync() error
	HTTPHandlers() map[string]http.HandlerFunc
}

// ServiceConfig is a struct that can configure a service
type ServiceConfig struct {
	Directory   string
	Format      string
	NumFetchers int64
	MaxPages    int
	WebPort     string
	FrontendURL string
	AdminPath   string
	Secrets     map[string]map[string]string
	Storage     storage.Storage
}

// LoadFromEnv loads any properties and secrets it can from the environment
func (config *ServiceConfig) LoadFromEnv() {
	if err := godotenv.Load(".env"); err != nil && !os.IsNotExist(err) {
		log.Printf("Could not load .env file in current directory %v", err)
	}
	dirEnv := filepath.Join(config.Directory, ".meta", ".env")
	if err := godotenv.Load(dirEnv); err != nil && !os.IsNotExist(err) {
		log.Printf("Could not load .env file in target directory %v", err)
	}
	config.WebPort = GetenvDefault("WEB_PORT", DefaultWebPort)
	config.FrontendURL = GetenvDefault("FRONTEND_URL", "http://localhost:"+config.WebPort)
	config.Secrets = map[string]map[string]string{
		"google": map[string]string{
			"ClientID":     os.Getenv("GOOGLE_CLIENT_ID"),
			"ClientSecret": os.Getenv("GOOGLE_CLIENT_SECRET"),
		},
		"instagram": map[string]string{
			"ClientID":     os.Getenv("INSTAGRAM_CLIENT_ID"),
			"ClientSecret": os.Getenv("INSTAGRAM_CLIENT_SECRET"),
		},
		"facebook": map[string]string{
			"ClientID":     os.Getenv("FACEBOOK_CLIENT_ID"),
			"ClientSecret": os.Getenv("FACEBOOK_CLIENT_SECRET"),
		},
	}
}

// ServiceCreator is a function that can create a sync service
type ServiceCreator func(serviceConfig *ServiceConfig) (SyncService, error)

// applyMaxPagesHeuristic should be called in Setup() by SyncService implementers, to
// apply this heuristic in a common way across all services
func applyMaxPagesHeuristic(svc SyncService, serviceConfig *ServiceConfig) {
	// Apply max pages heuristics
	if serviceConfig.MaxPages < 0 {
		serviceConfig.MaxPages = maxAllowablePages
	} else if serviceConfig.MaxPages == 0 {
		if svc.NeedsCredentials() {
			// First time we sync the whole thing
			serviceConfig.MaxPages = maxAllowablePages
		} else {
			// After that we just sync the latest page
			serviceConfig.MaxPages = 1
		}
	}
}

// displayErrorPage writes a basic text error message to the http response
func displayErrorPage(w http.ResponseWriter, msg string) {
	w.Write([]byte("Error: " + msg))
}

func saveOAuthData(store storage.Storage, tok *oauth2.Token, serviceName string) error {
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode authentication token to save: %v", err)
	}
	authdir := filepath.Join(".meta", serviceName)
	if err = store.EnsureDirectoryExists(authdir); err != nil {
		return fmt.Errorf("Could not create auth metadata directory: %v", err)
	}
	path := filepath.Join(authdir, "auth.json")
	if err = store.WriteBlob(path, encodedTok); err != nil {
		return fmt.Errorf("Could not write auth data to disk: %v", err)
	}
	return nil
}

func loadOAuthData(store storage.Storage, serviceName string) (*oauth2.Token, error) {
	path := filepath.Join(".meta", serviceName, "auth.json")
	if exists, err := store.Exists(path); err != nil {
		return nil, err
	} else if !exists {
		return nil, nil
	}
	encodedTok, err := store.ReadBlob(path)
	if err != nil {
		return nil, err
	}
	var tok *oauth2.Token
	if err = json.Unmarshal(encodedTok, &tok); err != nil {
		return nil, err
	}
	return tok, nil
}

func persistSyncData(store storage.Storage, serviceName string, syncData *ServiceSyncData) error {
	encoded, err := json.Marshal(syncData)
	if err != nil {
		log.Printf("Error: Could not encode data to save: %v", err)
		return fmt.Errorf("Could not encode data to save: %v", err)
	}
	datadir := filepath.Join(".meta", serviceName, "syncdata")
	if err = store.EnsureDirectoryExists(datadir); err != nil {
		log.Printf("Error: Could not create syncdata directory: %v", err)
		return fmt.Errorf("Could not create syncdata directory: %v", err)
	}
	path := filepath.Join(datadir, fmt.Sprintf("%d.json", syncData.Started.UnixNano()))
	if err = store.WriteBlob(path, encoded); err != nil {
		log.Printf("Error: Could not write sync data to disk: %v", err)
		return fmt.Errorf("Could not write sync data to disk: %v", err)
	}
	return nil
}

func handleSyncError(store storage.Storage, serviceName string, syncData *ServiceSyncData, count int) error {
	syncData.FailCount = incrementOrSet(syncData.FailCount, count)
	return persistSyncData(store, serviceName, syncData)
}

func persistSyncDataPostFetch(store storage.Storage, serviceName string, syncData *ServiceSyncData, fetchErr error, filePath, hash string) {
	if fetchErr == nil {
		syncData.FetchCount = incrementOrSet(syncData.FetchCount, 1)
		syncData.Hashes[filePath] = hash
		persistSyncData(store, serviceName, syncData)
	} else {
		syncData.FailCount = incrementOrSet(syncData.FailCount, 1)
		persistSyncData(store, serviceName, syncData)
	}
}

// ListServiceSyncDataPaths lists the paths to the ServiceSyncData
func ListServiceSyncDataPaths(store storage.Storage, serviceName string) ([]string, []int64, error) {
	names, err := store.ListDirectoryFiles(filepath.Join(".meta", serviceName, "syncdata"))
	if err != nil {
		return nil, nil, err
	}
	paths := make([]string, 0, len(names))
	values := make([]int64, 0, len(names))
	for _, filePath := range names {
		if !strings.HasSuffix(filePath, ".json") {
			continue
		}
		name := filepath.Base(filePath)
		// Check that it parses as a number
		value, err := strconv.ParseInt(strings.TrimSuffix(name, ".json"), 10, 64)
		if err != nil {
			continue
		}
		paths = append(paths, filePath)
		values = append(values, value)
	}
	return paths, values, nil
}

// GetLatestServiceSyncData gets the latest ServiceSyncData for the given service
func GetLatestServiceSyncData(store storage.Storage, serviceName string) (*ServiceSyncData, error) {
	paths, values, err := ListServiceSyncDataPaths(store, serviceName)
	largestPath := ""
	largestValue := int64(-1)
	for i, dataPath := range paths {
		if values[i] > largestValue {
			largestPath = dataPath
			largestValue = values[i]
		}
	}
	if largestValue == int64(-1) {
		return nil, nil
	}
	blob, err := store.ReadBlob(largestPath)
	if err != nil {
		return nil, err
	}
	syncData := &ServiceSyncData{}
	if err = json.Unmarshal(blob, &syncData); err != nil {
		return nil, err
	}
	return syncData, nil
}

// GetenvDefault gets an environment, but defaults to the parameter given if none is found
func GetenvDefault(name string, def string) string {
	ret := os.Getenv(name)
	if ret == "" {
		return def
	}
	return ret
}

// incrementOrSet either increments a null.Int value by the value, or creates a valid one from it
func incrementOrSet(toSet null.Int, val int) null.Int {
	if toSet.Valid {
		toSet.Int64 += int64(val)
		return toSet
	}
	return null.IntFrom(int64(val))
}

package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
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
	ID   string `json:"ID"`
	Name string `json:"name"`
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
			"ClientSecret": os.Getenv("INSTAGRAM_CLIENT_ID"),
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
		return fmt.Errorf("Could not encode Facebook authentication token to save: %v", err)
	}
	authdir := filepath.Join(".meta", serviceName)
	if err = store.EnsureDirectoryExists(authdir); err != nil {
		return fmt.Errorf("Could not create auth metadata directory: %v", err)
	}
	path := filepath.Join(authdir, "auth.json")
	if err = store.WriteBlob(path, encodedTok); err != nil {
		return fmt.Errorf("Could not write Facebook auth data to disk: %v", err)
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

// GetenvDefault gets an environment, but defaults to the parameter given if none is found
func GetenvDefault(name string, def string) string {
	ret := os.Getenv(name)
	if ret == "" {
		return def
	}
	return ret
}

package services

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
)

const maxAllowablePages = 1000000

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup() error
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
	Secrets     map[string]map[string]string
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
	config.WebPort = GetenvDefault("WEB_PORT", "5000")
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

// downloadURLToPath downloads the given url to the specified path, using a temporary
// file and renaming in the end in an idempotent way
func downloadURLToPath(url, path string) error {
	log.Println("Downloading item", path)

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	tmpFile, err := ioutil.TempFile(filepath.Dir(path), ".tmpdownload-")
	if err != nil {
		defer os.Remove(tmpFile.Name())
		log.Println("Could not create temporary file:", err)
		return fmt.Errorf("Could not create temporary file: %v", err)
	}

	_, err = io.Copy(tmpFile, resp.Body)
	if err != nil {
		defer os.Remove(tmpFile.Name())
		log.Println("Error downloading file:", err)
		return fmt.Errorf("Error downloading file: %v", err)
	}

	err = tmpFile.Close()
	if err != nil {
		defer os.Remove(tmpFile.Name())
		log.Println("Could not close temporary file:", err)
		return fmt.Errorf("Could not close temporary file: %v", err)
	}

	return os.Rename(tmpFile.Name(), path)
}

func saveOAuthData(tok *oauth2.Token, baseDir, serviceName string) error {
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode Facebook authentication token to save: %v", err)
	}
	authdir := filepath.Join(baseDir, ".meta", serviceName)
	if err = os.MkdirAll(authdir, 0644); err != nil {
		return fmt.Errorf("Could not create auth metadata directory: %v", err)
	}
	path := filepath.Join(authdir, "auth.json")
	if err = ioutil.WriteFile(path, encodedTok, 0644); err != nil {
		return fmt.Errorf("Could not write Facebook auth data to disk: %v", err)
	}
	return nil
}

func loadOAuthData(baseDir, serviceName string) (*oauth2.Token, error) {
	path := filepath.Join(baseDir, ".meta", serviceName, "auth.json")
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

// GetenvDefault gets an environment, but defaults to the parameter given if none is found
func GetenvDefault(name string, def string) string {
	ret := os.Getenv(name)
	if ret == "" {
		return def
	}
	return ret
}

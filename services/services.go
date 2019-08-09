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

	"golang.org/x/oauth2"
)

const maxAllowablePages = 1000000

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup() error
	NeedsCredentials() bool
	CredentialRedirectURL() string
	Sync() error
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

// ServiceConfig is a struct that can configure a service
type ServiceConfig struct {
	Directory   string
	Format      string
	NumFetchers int64
	MaxPages    int
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

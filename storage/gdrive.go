package storage

import (
	"errors"
	"log"
	"time"

	"maxint.co/mediasummon/userconfig"
)

type gdriveStorage struct {
	userConfig *userconfig.UserConfig
	directory  string
}

// NewGDriveStorage creates a new storage interface that can talk to Google Drive
func NewGDriveStorage(userConfig *userconfig.UserConfig, directory string) (Storage, error) {
	tok, err := loadOAuthData(userConfig, "gdrive")
	if err != nil {
		return nil, err
	}
	log.Println("Token", tok)
	store := &gdriveStorage{
		userConfig: userConfig,
		directory:  directory,
	}
	return store, nil
}

// URL returns the string of the url to this storage interface
func (store *gdriveStorage) URL() string {
	return NormalizeStorageURL("gdrive://" + store.directory)
}

// Protocol returns the protocol of the url to this storage interface
func (store *gdriveStorage) Protocol() string {
	return "gdrive"
}

// Exists returns true if the path refers to a file that exists in the Google Drive directory
func (store *gdriveStorage) Exists(path string) (bool, error) {
	/*
		segments := []string{}
		splitPath := strings.Split(path, "/")
		if splitPath == nil {
			return false, errors.New("Cannot access the root of Google Drive")
		}
		for _, part := range splitPath {

		}
	*/
	return false, errors.New("Not implemented")
}

// EnsureDirectoryExists makes sure that the given "directory" exists in Google Drive, or it returns an error.
func (store *gdriveStorage) EnsureDirectoryExists(path string) error {
	return errors.New("Not implemented")
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on Google Drive, using a temporary file in-between
func (store *gdriveStorage) DownloadFromURL(url, path string) (string, error) {
	return "", errors.New("Not implemented")
}

// ReadBlob reads the Google Drive blob at the given path into memory and returns it as a slice of bytes
func (store *gdriveStorage) ReadBlob(path string) ([]byte, error) {
	return nil, errors.New("Not implemented")
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *gdriveStorage) WriteBlob(path string, blob []byte) error {
	return errors.New("Not implemented")
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *gdriveStorage) ListDirectoryFiles(path string) ([]string, error) {
	return nil, errors.New("Not implemented")
}

// NeedsCredentials returns an error if it needs credentials, nil if it does not
func (store *gdriveStorage) NeedsCredentials() error {
	cID, _ := store.userConfig.GetSecret("gdrive", "client_id")
	cSecret, _ := store.userConfig.GetSecret("gdrive", "client_secret")
	if cID == "" || cSecret == "" {
		return userconfig.ErrNeedSecrets
	}
	tok, err := loadOAuthData(store.userConfig, "gdrive")
	if err != nil || tok == nil || tok.AccessToken == "" || tok.Expiry.Before(time.Now()) {
		return ErrNeedAuth
	}
	return nil
}

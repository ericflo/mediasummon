package storage

import (
	"errors"
	"log"
	"path/filepath"
)

// SStorage represents a a method of storing and retrieving data
type SStorage interface {
	URL() string
	Protocol() string
	Exists(path string) (bool, error)
	EnsureDirectoryExists(path string) error
	DownloadFromURL(url, path string) (string, error)
	ReadBlob(path string) ([]byte, error)
	WriteBlob(path string, blob []byte) error
	ListDirectoryFiles(path string) ([]string, error)
}

type dropboxStorage struct {
	storageConfig *Config
	directory     string
}

// NewDropboxStorage creates a new storage interface that can talk to Dropbox
func NewDropboxStorage(storageConfig *Config, directory string) (Storage, error) {
	store := &dropboxStorage{
		storageConfig: storageConfig,
		directory:     directory,
	}
	return store, nil
}

// URL returns the string of the url to this storage interface
func (store *dropboxStorage) URL() string {
	return NormalizeStorageURL("dropbox://" + store.directory)
}

// Protocol returns the protocol of the url to this storage interface
func (store *dropboxStorage) Protocol() string {
	return "dropbox"
}

// Exists returns true if the path refers to a file that exists in the Dropbox folder
func (store *dropboxStorage) Exists(path string) (bool, error) {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	log.Println("fullPath", fullPath)
	return false, errors.New("Not implemented")
}

// EnsureDirectoryExists makes sure that the given "directory" exists in Dropbox, or it returns an error.
func (store *dropboxStorage) EnsureDirectoryExists(path string) error {
	return errors.New("Not implemented")
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on Dropbox, using a temporary file in-between
func (store *dropboxStorage) DownloadFromURL(url, path string) (string, error) {
	return "", errors.New("Not implemented")
}

// ReadBlob reads the Dropbox blob at the given path into memory and returns it as a slice of bytes
func (store *dropboxStorage) ReadBlob(path string) ([]byte, error) {
	return nil, errors.New("Not implemented")
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *dropboxStorage) WriteBlob(path string, blob []byte) error {
	return errors.New("Not implemented")
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *dropboxStorage) ListDirectoryFiles(path string) ([]string, error) {
	return nil, errors.New("Not implemented")
}

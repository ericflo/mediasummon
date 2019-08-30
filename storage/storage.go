package storage

import (
	"fmt"
	netURL "net/url"
)

// Storage represents a a method of storing and retrieving data
type Storage interface {
	Exists(path string) (bool, error)
	EnsureDirectoryExists(path string) error
	DownloadFromURL(url, path string) (string, error)
	ReadBlob(path string) ([]byte, error)
	WriteBlob(path string, blob []byte) error
	ListDirectoryFiles(path string) ([]string, error)
}

// NewStorage takes the given URLs and returns the appropriate configured storage interface
func NewStorage(urls []string) (*Multi, error) {
	stores := []Storage{}
	for _, url := range urls {
		parsedURL, err := netURL.Parse(url)
		if err != nil {
			return nil, err
		}
		// If it's a single-letter scheme, it's Windows and a drive letter, so just pass the whole
		// url as the base path to the underlying file storage layer
		if len(parsedURL.Scheme) == 1 {
			store, err := NewFileStorage(url)
			if err != nil {
				return nil, err
			}
			stores = append(stores, store)
			continue
		}
		switch parsedURL.Scheme {
		case "file", "":
			store, err := NewFileStorage(parsedURL.Path)
			if err != nil {
				return nil, err
			}
			stores = append(stores, store)
			continue
		}

		return nil, fmt.Errorf("Could not load storage for scheme: %v (%v)", parsedURL.Scheme, url)
	}
	return &Multi{Stores: stores}, nil

}

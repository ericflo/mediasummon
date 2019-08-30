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

// NewStorage takes the given URL and returns the appropriate configured storage interface
func NewStorage(url string) (Storage, error) {
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
		return &Multi{Stores: []Storage{store}}, nil
	}
	switch parsedURL.Scheme {
	case "file", "":
		store, err := NewFileStorage(parsedURL.Path)
		if err != nil {
			return nil, err
		}
		return &Multi{Stores: []Storage{store}}, nil
	}
	return nil, fmt.Errorf("Could not load storage for scheme: %v (%v)", parsedURL.Scheme, url)
}

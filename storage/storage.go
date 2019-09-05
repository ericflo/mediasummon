package storage

import (
	"errors"
	"fmt"
	"log"
	netURL "net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/mitchellh/go-homedir"
	"maxint.co/mediasummon/userconfig"
)

var filePrefixes = []string{".", "./", "/"}

// ErrNeedAuth is the error returned when we can't find authentication for a storage interface
var ErrNeedAuth = errors.New("Could not find authentication for storage interface")

// storageCache stores a cache of storage.Multi instances per userConfig
var storageCache = map[string]*Multi{}

// Storage represents a a method of storing and retrieving data
type Storage interface {
	URL() string
	Protocol() string
	Exists(path string) (bool, error)
	EnsureDirectoryExists(path string) error
	DownloadFromURL(url, path string) (string, error)
	ReadBlob(path string) ([]byte, error)
	WriteBlob(path string, blob []byte) error
	ListDirectoryFiles(path string) ([]string, error)

	NeedsCredentials() error
}

// NewStorageSingle instantiates a single storage interface from a single URL (rather than the default,
// which is to take in a slice of urls and return a Multi storage interface)
func NewStorageSingle(userConfig *userconfig.UserConfig, url string) (Storage, error) {
	normalized := NormalizeStorageURL(url)
	parsedURL, err := netURL.Parse(normalized)
	if err != nil {
		return nil, err
	}
	switch parsedURL.Scheme {
	case "s3":
		return NewS3Storage(userConfig, parsedURL.Host+parsedURL.Path)
	case "dropbox":
		return NewDropboxStorage(userConfig, parsedURL.Host+parsedURL.Path)
	case "gdrive":
		return NewGDriveStorage(userConfig, parsedURL.Host+parsedURL.Path)
	case "file":
		if len(parsedURL.Path) == 0 {
			return nil, fmt.Errorf("Invalid URL: %v", url)
		}
		return NewFileStorage(userConfig, parsedURL.Path[1:])
	}
	return nil, fmt.Errorf("Could not load storage for scheme: %v (%v) ((%v))", parsedURL.Scheme, url, normalized)
}

// NewStorage takes the given URLs and returns the appropriate configured storage interface
func NewStorage(userConfig *userconfig.UserConfig) (*Multi, error) {
	stores := []Storage{}
	for _, url := range userConfig.Targets {
		store, err := NewStorageSingle(userConfig, url)
		if err != nil {
			return nil, err
		}
		stores = append(stores, store)
	}
	return &Multi{Stores: stores}, nil
}

// CachedStorage instantiates, caches, and returns a *Multi struct for the given user config
func CachedStorage(userConfig *userconfig.UserConfig) (*Multi, error) {
	store, _ := storageCache[userConfig.Path]
	if store != nil {
		return store, nil
	}
	store, err := NewStorage(userConfig)
	if err != nil || store == nil {
		return nil, fmt.Errorf("Could not initialize storage interface: %v", err)
	}
	storageCache[userConfig.Path] = store
	return store, nil
}

// NormalizeStorageURL takes any path or url and normalizes it into a canonical url for use in the system
func NormalizeStorageURL(orig string) string {
	if strings.HasPrefix(orig, "~") {
		if expanded, err := homedir.Expand(orig); err != nil {
			log.Println("Couldn't expand homedir", orig, err)
		} else {
			return "file:///" + expanded
		}
	} else if strings.HasPrefix(orig, "/~") {
		if expanded, err := homedir.Expand(orig[1:]); err != nil {
			log.Println("Couldn't expand homedir", orig, err)
		} else {
			return "file:///" + expanded
		}
	}

	// Special case check for certain string prefixes, which we shortcut into turning into an absolute file url
	for _, filePrefix := range filePrefixes {
		if strings.HasPrefix(orig, filePrefix) {
			abs, err := filepath.Abs(orig)
			if err != nil {
				log.Println("Failed to normalize url - could not make special case filepath absolute:", orig, err)
				return orig
			}
			return "file:///" + abs
		}
	}

	// Otherwise we need to try to parse the URL and inspect it more closely

	// Parse the URL
	parsedURL, err := netURL.Parse(orig)
	if err != nil {
		log.Println("Failed to normalize url - could not parse url:", orig, err)
		return orig
	}

	if strings.HasPrefix(parsedURL.Path, "~") {
		if expanded, err := homedir.Expand(parsedURL.Path); err != nil {
			log.Println("Couldn't expand homedir", parsedURL.Path, err)
		} else {
			return "file:///" + expanded
		}
	} else if strings.HasPrefix(parsedURL.Path, "/~") {
		if expanded, err := homedir.Expand(parsedURL.Path[1:]); err != nil {
			log.Println("Couldn't expand homedir", orig, err)
		} else {
			return "file:///" + expanded
		}
	}

	// If there was no scheme, it's probably a relative path like 'path/to/media', so give it file:// and
	// make the path absolute
	if parsedURL.Scheme == "" {
		abs, err := filepath.Abs(parsedURL.Path)
		if err != nil {
			log.Println("Failed to normalize url - could not make relative filepath absolute:", orig, err)
			return orig
		}
		return "file:///" + abs
	}

	// If it's a single-letter scheme, it's Windows and a drive letter, so compensate
	if len(parsedURL.Scheme) == 1 {
		return "file:///" + orig
	}

	return parsedURL.Scheme + "://" + parsedURL.Host + parsedURL.Path
}

func normalizePath(pth string) string {
	if os.PathSeparator == '\\' {
		return strings.ReplaceAll(pth, "\\", "/")
	}
	return pth
}

package storage

import (
	"bytes"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox"
	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox/files"
	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox/users"
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
	dropboxConfig dropbox.Config
	usersClient   users.Client
	filesClient   files.Client
}

// NewDropboxStorage creates a new storage interface that can talk to Dropbox
func NewDropboxStorage(storageConfig *Config, directory string) (Storage, error) {
	dropboxConfig := dropbox.Config{
		Token:    storageConfig.Dropbox.Token,
		LogLevel: dropbox.LogInfo, // if needed, set the desired logging level. Default is off
	}
	store := &dropboxStorage{
		storageConfig: storageConfig,
		directory:     directory,
		dropboxConfig: dropboxConfig,
		usersClient:   users.New(dropboxConfig),
		filesClient:   files.New(dropboxConfig),
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
	arg := files.NewGetMetadataArg(fullPath)
	resp, err := store.filesClient.GetMetadata(arg)
	if err != nil {
		return false, err
	}
	return resp != nil, nil
}

// EnsureDirectoryExists makes sure that the given "directory" exists in Dropbox, or it returns an error.
func (store *dropboxStorage) EnsureDirectoryExists(path string) error {
	if exists, err := store.Exists(path); err != nil {
		return err
	} else if exists {
		return nil
	}
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewCreateFolderArg(fullPath)
	_, err := store.filesClient.CreateFolder(arg)
	return err
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on Dropbox, using a temporary file in-between
func (store *dropboxStorage) DownloadFromURL(url, path string) (string, error) {
	log.Println("Downloading item", path)

	fullPath := normalizePath(filepath.Join(store.directory, path))

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	tmpFile, err := ioutil.TempFile(filepath.Dir(os.TempDir()), ".tmpdownload-")
	if err != nil || tmpFile == nil {
		log.Println("Could not create temporary file:", err)
		return "", fmt.Errorf("Could not create temporary file: %v", err)
	}
	defer os.Remove(tmpFile.Name())

	sha512 := sha512.New()
	multiWriter := io.MultiWriter(tmpFile, sha512)

	if _, err = io.Copy(multiWriter, resp.Body); err != nil {
		log.Println("Error downloading file:", err)
		return "", fmt.Errorf("Error downloading file: %v", err)
	}

	if _, err = tmpFile.Seek(0, 0); err != nil {
		log.Println("Could not seek back to beginning of tempfile", err)
		return "", err
	}

	arg := files.NewCommitInfo(fullPath)
	_, err = store.filesClient.Upload(arg, tmpFile)
	if err != nil {
		return "", err
	}

	if err = tmpFile.Close(); err != nil {
		log.Println("Could not close temporary file:", err)
	}

	return hex.EncodeToString(sha512.Sum(nil)), nil
}

// ReadBlob reads the Dropbox blob at the given path into memory and returns it as a slice of bytes
func (store *dropboxStorage) ReadBlob(path string) ([]byte, error) {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewDownloadArg(fullPath)
	_, body, err := store.filesClient.Download(arg)
	if err != nil {
		return nil, err
	}
	defer body.Close()
	return ioutil.ReadAll(body)
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *dropboxStorage) WriteBlob(path string, blob []byte) error {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewCommitInfo(fullPath)
	_, err := store.filesClient.Upload(arg, bytes.NewBuffer(blob))
	return err
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *dropboxStorage) ListDirectoryFiles(path string) ([]string, error) {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	paths := []string{}
	hasMore := true
	cursor := ""
	for hasMore {
		if cursor == "" {
			arg := files.NewListFolderArg(fullPath)
			resp, err := store.filesClient.ListFolder(arg)
			if err != nil {
				return nil, err
			}
			for _, entry := range resp.Entries {
				if meta, ok := entry.(*files.FileMetadata); ok {
					paths = append(paths, strings.TrimPrefix(meta.PathLower, path))
				}
			}
			hasMore = resp.HasMore
			cursor = resp.Cursor
		} else {
			arg := files.NewListFolderContinueArg(cursor)
			resp, err := store.filesClient.ListFolderContinue(arg)
			if err != nil {
				return nil, err
			}
			for _, entry := range resp.Entries {
				if meta, ok := entry.(*files.FileMetadata); ok {
					paths = append(paths, strings.TrimPrefix(meta.PathLower, path))
				}
			}
			hasMore = resp.HasMore
			cursor = resp.Cursor
		}
	}
	return paths, nil
}

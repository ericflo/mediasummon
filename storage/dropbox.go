package storage

import (
	"bytes"
	"context"
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
	"time"

	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox"
	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox/files"
	"github.com/dropbox/dropbox-sdk-go-unofficial/dropbox/users"
	"golang.org/x/sync/semaphore"
	"maxint.co/mediasummon/userconfig"
)

type dropboxStorage struct {
	userConfig    *userconfig.UserConfig
	directory     string
	dropboxConfig dropbox.Config
	usersClient   users.Client
	filesClient   files.Client
	sem           *semaphore.Weighted
}

// NewDropboxStorage creates a new storage interface that can talk to Dropbox
func NewDropboxStorage(userConfig *userconfig.UserConfig, directory string) (Storage, error) {
	dropboxConfig := dropbox.Config{
		//LogLevel: dropbox.LogDebug,
	}
	tok, err := loadOAuthData(userConfig, "dropbox")
	if err != nil && err != userconfig.ErrNeedSecrets {
		return nil, err
	}
	if tok != nil {
		dropboxConfig.Token = tok.AccessToken
	}

	store := &dropboxStorage{
		userConfig:    userConfig,
		directory:     directory,
		dropboxConfig: dropboxConfig,
		usersClient:   users.New(dropboxConfig),
		filesClient:   files.New(dropboxConfig),
		sem:           semaphore.NewWeighted(4),
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
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return false, err
	}
	defer store.sem.Release(1)
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewGetMetadataArg(fullPath)
	resp, err := store.filesClient.GetMetadata(arg)
	if err != nil {
		if strings.Contains(err.Error(), "not_found") {
			err = nil
		}
		return false, nil
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
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return err
	}
	defer store.sem.Release(1)
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewCreateFolderArg(fullPath)
	_, err := store.filesClient.CreateFolderV2(arg)
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

	tmpFile, err := ioutil.TempFile(os.TempDir(), ".tmpdownload-")
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

	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return "", err
	}
	defer store.sem.Release(1)

	arg := files.NewCommitInfo(fullPath)
	arg.StrictConflict = false
	arg.Mode = &files.WriteMode{Tagged: dropbox.Tagged{Tag: files.WriteModeOverwrite}}
	_, err = store.filesClient.Upload(arg, tmpFile)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(sha512.Sum(nil)), nil
}

// ReadBlob reads the Dropbox blob at the given path into memory and returns it as a slice of bytes
func (store *dropboxStorage) ReadBlob(path string) ([]byte, error) {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return nil, err
	}
	defer store.sem.Release(1)
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewDownloadArg(fullPath)
	_, body, err := store.filesClient.Download(arg)
	if err != nil {
		if strings.Contains(err.Error(), "not_found") {
			return []byte{}, nil
		}
		return nil, err
	}
	defer body.Close()
	return ioutil.ReadAll(body)
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *dropboxStorage) WriteBlob(path string, blob []byte) error {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return err
	}
	defer store.sem.Release(1)
	fullPath := normalizePath(filepath.Join(store.directory, path))
	arg := files.NewCommitInfo(fullPath)
	arg.StrictConflict = false
	arg.Mode = &files.WriteMode{Tagged: dropbox.Tagged{Tag: files.WriteModeOverwrite}}
	_, err := store.filesClient.Upload(arg, bytes.NewBuffer(blob))
	return err
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *dropboxStorage) ListDirectoryFiles(path string) ([]string, error) {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return nil, err
	}
	defer store.sem.Release(1)
	fullPath := normalizePath(filepath.Join(store.directory, path))
	lowerDir := strings.ToLower(store.directory)
	paths := []string{}
	hasMore := true
	cursor := ""
	for hasMore {
		if cursor == "" {
			arg := files.NewListFolderArg(fullPath)
			resp, err := store.filesClient.ListFolder(arg)
			if err != nil {
				if strings.Contains(err.Error(), "not_found") {
					err = nil
				}
				return nil, err
			}
			for _, entry := range resp.Entries {
				if meta, ok := entry.(*files.FileMetadata); ok {
					paths = append(paths, strings.TrimPrefix(strings.TrimPrefix(meta.PathLower, lowerDir), "/"))
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
					paths = append(paths, strings.TrimPrefix(strings.TrimPrefix(meta.PathLower, lowerDir), "/"))
				}
			}
			hasMore = resp.HasMore
			cursor = resp.Cursor
		}
	}
	return paths, nil
}

// NeedsCredentials returns an error if it needs credentials, nil if it does not
func (store *dropboxStorage) NeedsCredentials() error {
	cID, _ := store.userConfig.GetSecret("dropbox", "client_id")
	cSecret, _ := store.userConfig.GetSecret("dropbox", "client_secret")
	if cID == "" || cSecret == "" {
		return userconfig.ErrNeedSecrets
	}
	tok, err := loadOAuthData(store.userConfig, "dropbox")
	if err != nil || tok == nil || tok.AccessToken == "" || (tok.Expiry.Before(time.Now()) && !tok.Expiry.IsZero()) {
		return ErrNeedAuth
	}
	return nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (store *dropboxStorage) CredentialRedirectURL() (string, error) {
	oauthConf, err := oAuth2Conf(store.userConfig, "dropbox", dropboxEndpoint, dropboxScopes)
	if err != nil {
		return "", err
	}
	return oauthConf.AuthCodeURL(store.userConfig.Path), nil
}

// AppCreateURL returns the URL where the user can create an app to get credentials
func (store *dropboxStorage) AppCreateURL() string {
	return "https://www.dropbox.com/developers/apps/create"
}

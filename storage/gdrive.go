package storage

import (
	"bytes"
	"context"
	"crypto/sha512"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v3"
	"maxint.co/mediasummon/userconfig"
)

// ErrNeedsAuth is returned when the storage interface is attempting to be used but is not authorized
var ErrNeedsAuth = errors.New("Need to be authenticated before you can use this storage interface")

// ErrGDriveFileNotFound is returned when the file is not found in Google Drive
var ErrGDriveFileNotFound = errors.New("Google drive file was not found")

type gdriveStorage struct {
	userConfig *userconfig.UserConfig
	directory  string
	srv        *drive.Service
}

// NewGDriveStorage creates a new storage interface that can talk to Google Drive
func NewGDriveStorage(userConfig *userconfig.UserConfig, directory string) (Storage, error) {
	store := &gdriveStorage{userConfig: userConfig, directory: directory}

	tok, err := loadOAuthData(userConfig, "gdrive")
	if err != nil && err != userconfig.ErrNeedSecrets {
		return nil, err
	}
	if tok != nil {
		config, err := oAuth2Conf(userConfig, "gdrive", google.Endpoint, gdriveScopes)
		if err != nil && err != userconfig.ErrNeedSecrets {
			return nil, err
		}
		if config != nil {
			client := config.Client(context.Background(), tok)
			srv, err := drive.New(client)
			if err != nil && err != userconfig.ErrNeedSecrets {
				return nil, err
			}
			store.srv = srv
		}
	}

	return store, nil
}

// URL returns the string of the url to this storage interface
func (store *gdriveStorage) URL() string {
	return NormalizeStorageURL("gdrive://")
}

// Protocol returns the protocol of the url to this storage interface
func (store *gdriveStorage) Protocol() string {
	return "gdrive"
}

// Exists returns true if the path refers to a file that exists in the Google Drive directory
func (store *gdriveStorage) Exists(path string) (bool, error) {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	_, err := store.fileObjFromPath(fullPath)
	if err != nil {
		return false, err
	}
	return true, nil
}

// EnsureDirectoryExists makes sure that the given "directory" exists in Google Drive, or it returns an error.
func (store *gdriveStorage) EnsureDirectoryExists(path string) error {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	_, err := store.ensureDirectoryExists(fullPath)
	return err
}

// ensureDirectoryExists is the same as the above, but returns the Google Drive file object along
// with the error, and does not adjust or normalize the path in any way
func (store *gdriveStorage) ensureDirectoryExists(path string) (*drive.File, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}
	parent := "appDataFolder"
	var f *drive.File
	splitPath := strings.Split(path, "/")
	for _, pathSegment := range splitPath {
		q := fmt.Sprintf("'%s' in parents and name = '%s'", parent, pathSegment)
		resp, err := store.srv.Files.List().Q(q).PageSize(10).Fields("nextPageToken, files(id, name)").Do()
		if err != nil {
			return nil, err
		}
		if len(resp.Files) == 0 {
			tmpFile := &drive.File{
				Name:     pathSegment,
				MimeType: "application/vnd.google-apps.folder",
				Parents:  []string{f.Id},
			}
			f, err = store.srv.Files.Create(tmpFile).Do()
			if err != nil {
				return nil, err
			}
		} else {
			f = resp.Files[0]
		}
		parent = f.Id
	}
	return f, nil
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on Google Drive, using a temporary file in-between
func (store *gdriveStorage) DownloadFromURL(url, path string) (string, error) {
	if store.srv == nil {
		return "", ErrNeedsAuth
	}

	log.Println("Downloading item", path)

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

	fullPath := normalizePath(filepath.Join(store.directory, path))

	f, err := store.ensureDirectoryExists(filepath.Dir(fullPath))
	if err != nil {
		return "", err
	}

	newFile := &drive.File{
		Name:    filepath.Base(fullPath),
		Parents: []string{f.Id},
	}
	_, err = store.srv.Files.Create(newFile).Media(tmpFile).Do()
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(sha512.Sum(nil)), nil
}

// ReadBlob reads the Google Drive blob at the given path into memory and returns it as a slice of bytes
func (store *gdriveStorage) ReadBlob(path string) ([]byte, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}
	fullPath := normalizePath(filepath.Join(store.directory, path))
	f, err := store.fileObjFromPath(fullPath)
	if err != nil {
		return nil, err
	}
	resp, err := store.srv.Files.Get(f.Id).Download()
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *gdriveStorage) WriteBlob(path string, blob []byte) error {
	if store.srv == nil {
		return ErrNeedsAuth
	}
	fullPath := normalizePath(filepath.Join(store.directory, path))
	f, err := store.ensureDirectoryExists(filepath.Dir(fullPath))
	if err != nil {
		return err
	}
	newFile := &drive.File{
		Name:    filepath.Base(fullPath),
		Parents: []string{f.Id},
	}
	_, err = store.srv.Files.Create(newFile).Media(bytes.NewBuffer(blob)).Do()
	if err != nil {
		return err
	}
	return nil
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *gdriveStorage) ListDirectoryFiles(path string) ([]string, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}
	fullPath := normalizePath(filepath.Join(store.directory, path))
	f, err := store.ensureDirectoryExists(fullPath)
	if err != nil {
		return nil, err
	}
	q := fmt.Sprintf("'%s' in parents", f.Id)
	resp, err := store.srv.Files.List().Q(q).PageSize(200).Fields("nextPageToken, files(id, name)").Do()
	if err != nil {
		return nil, err
	}
	names := make([]string, 0, len(resp.Files))
	for _, file := range resp.Files {
		names = append(names, file.Name)
	}
	return names, nil
}

// NeedsCredentials returns an error if it needs credentials, nil if it does not
func (store *gdriveStorage) NeedsCredentials() error {
	cID, _ := store.userConfig.GetSecret("gdrive", "client_id")
	cSecret, _ := store.userConfig.GetSecret("gdrive", "client_secret")
	if cID == "" || cSecret == "" {
		return userconfig.ErrNeedSecrets
	}
	tok, err := loadOAuthData(store.userConfig, "gdrive")
	if err != nil || tok == nil || tok.AccessToken == "" || (tok.Expiry.Before(time.Now()) && !tok.Expiry.IsZero()) {
		return ErrNeedAuth
	}
	return nil
}

// CredentialRedirectURL creates a URL for the user to visit to grant credentials
func (store *gdriveStorage) CredentialRedirectURL() (string, error) {
	oauthConf, err := oAuth2Conf(store.userConfig, "gdrive", google.Endpoint, gdriveScopes)
	if err != nil {
		return "", err
	}
	return oauthConf.AuthCodeURL(store.userConfig.Path), nil
}

// AppCreateURL returns the URL where the user can create an app to get credentials
func (store *gdriveStorage) AppCreateURL() string {
	//return "https://console.cloud.google.com/apis/credentials/oauthclient"
	return "https://console.developers.google.com/apis/api/drive.googleapis.com/credentials"
}

func (store *gdriveStorage) fileObjFromPath(path string) (*drive.File, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}

	parent := "appDataFolder"
	var f *drive.File
	splitPath := strings.Split(path, "/")
	for _, pathSegment := range splitPath {
		q := fmt.Sprintf("'%s' in parents and name = '%s'", parent, pathSegment)
		resp, err := store.srv.Files.List().Q(q).PageSize(10).Fields("nextPageToken, files(id, name)").Do()
		if err != nil {
			return nil, err
		}
		if len(resp.Files) == 0 {
			return nil, ErrGDriveFileNotFound
		}
		f = resp.Files[0]
		parent = f.Id
	}

	return f, nil
}

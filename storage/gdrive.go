package storage

import (
	"bytes"
	"context"
	"crypto/sha512"
	"encoding/gob"
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
	"golang.org/x/sync/semaphore"
	"google.golang.org/api/drive/v3"
	"maxint.co/mediasummon/userconfig"
)

// ErrNeedsAuth is returned when the storage interface is attempting to be used but is not authorized
var ErrNeedsAuth = errors.New("Need to be authenticated before you can use this storage interface")

// ErrGDriveFileNotFound is returned when the file is not found in Google Drive
var ErrGDriveFileNotFound = errors.New("Google drive file was not found")

//const googleDriveRoot = "appDataFolder"
const googleDriveRoot = "root"

type gdriveStorage struct {
	userConfig *userconfig.UserConfig
	directory  string
	srv        *drive.Service
	cache      map[string][]byte
	sem        *semaphore.Weighted
}

// NewGDriveStorage creates a new storage interface that can talk to Google Drive
func NewGDriveStorage(userConfig *userconfig.UserConfig, directory string) (Storage, error) {
	store := &gdriveStorage{
		userConfig: userConfig,
		directory:  directory,
		cache:      map[string][]byte{},
		sem:        semaphore.NewWeighted(1),
	}

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
	return NormalizeStorageURL("gdrive://" + store.directory)
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
		if err == ErrGDriveFileNotFound {
			err = nil
		}
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

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on Google Drive, using a temporary file in-between
func (store *gdriveStorage) DownloadFromURL(url, path string) (string, error) {
	if store.srv == nil {
		return "", ErrNeedsAuth
	}

	fullPath := normalizePath(filepath.Join(store.directory, path))

	log.Println("Downloading item", fullPath)

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

	f, err := store.ensureDirectoryExists(filepath.Dir(fullPath))
	if err != nil {
		return "", err
	}

	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return "", err
	}
	defer store.sem.Release(1)

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
		if err == ErrGDriveFileNotFound {
			err = nil
		}
		return nil, err
	}
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return nil, err
	}
	defer store.sem.Release(1)
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

	f, err := store.fileObjFromPath(fullPath)
	if err != nil && err != ErrGDriveFileNotFound {
		return err
	}

	if err == ErrGDriveFileNotFound {
		f, err = store.ensureDirectoryExists(filepath.Dir(fullPath))
		if err != nil {
			return err
		}
		if err := store.sem.Acquire(context.TODO(), 1); err != nil {
			return err
		}
		defer store.sem.Release(1)
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

	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return err
	}
	defer store.sem.Release(1)
	_, err = store.srv.Files.Update(f.Id, nil).Media(bytes.NewBuffer(blob)).Do()
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
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		return nil, err
	}
	defer store.sem.Release(1)
	q := fmt.Sprintf("'%s' in parents and trashed=false", f.Id)
	resp, err := store.srv.Files.List().Q(q).PageSize(200).Fields("nextPageToken, files(id, name)").Do()
	if err != nil {
		return nil, err
	}
	names := make([]string, 0, len(resp.Files))
	for _, file := range resp.Files {
		names = append(names, strings.TrimPrefix(file.Name, fullPath))
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
	return store.fileObj(path, googleDriveRoot)
}

// ensureDirectoryExists is the same as the exported version, but returns the Google Drive file
// object along with the error, and does not adjust or normalize the path in any way
func (store *gdriveStorage) ensureDirectoryExists(path string) (*drive.File, error) {
	return store.ensureDirObj(path, googleDriveRoot)
}

func (store *gdriveStorage) fileObj(path, parent string) (*drive.File, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}
	splitPath := strings.Split(normalizePath(path), "/")
	if len(splitPath) == 0 {
		return nil, errors.New("Split path by / and got zero element slice")
	}

	if len(splitPath) == 1 {
		cacheKey := splitPath[0] + "|" + parent
		if data, ok := store.cache[cacheKey]; ok {
			return decodeDriveFile(data)
		}

		if err := store.sem.Acquire(context.TODO(), 1); err != nil {
			return nil, err
		}
		defer store.sem.Release(1)

		q := fmt.Sprintf("'%s' in parents and name = '%s' and trashed=false", parent, splitPath[0])

		resp, err := store.srv.Files.List().Q(q).PageSize(1).Fields("nextPageToken, files(id, name)").Do()
		if err != nil {
			return nil, err
		}
		if len(resp.Files) == 0 {
			return nil, ErrGDriveFileNotFound
		}
		f := resp.Files[0]

		data, err := encodeDriveFile(f)
		if err != nil {
			return nil, err
		}
		store.cache[cacheKey] = data
		return f, nil
	}

	var f *drive.File
	var err error
	for _, pathSegment := range splitPath {
		f, err = store.fileObj(pathSegment, parent)
		if err != nil {
			return nil, err
		}
		parent = f.Id
	}
	return f, nil
}

func (store *gdriveStorage) ensureDirObj(path, parent string) (*drive.File, error) {
	if store.srv == nil {
		return nil, ErrNeedsAuth
	}
	splitPath := strings.Split(normalizePath(path), "/")
	if len(splitPath) == 0 {
		return nil, errors.New("Split path by / and got zero element slice")
	}

	cacheKey := splitPath[0] + "|" + parent

	var f *drive.File
	var err error

	if len(splitPath) == 1 {
		if data, ok := store.cache[cacheKey]; ok {
			return decodeDriveFile(data)
		}

		if err := store.sem.Acquire(context.TODO(), 1); err != nil {
			return nil, err
		}
		defer store.sem.Release(1)

		q := fmt.Sprintf("'%s' in parents and name = '%s' and trashed=false", parent, splitPath[0])
		parents := []string{parent}
		resp, err := store.srv.Files.List().Q(q).PageSize(1).Fields("nextPageToken, files(id, name)").Do()
		if err != nil {
			return nil, err
		}
		if len(resp.Files) == 0 {
			tmpFile := &drive.File{
				Name:     splitPath[0],
				MimeType: "application/vnd.google-apps.folder",
				Parents:  parents,
			}
			log.Println("Creating directory (", splitPath[0], ",", parents[0], ")")
			f, err = store.srv.Files.Create(tmpFile).Do()
			if err != nil {
				return nil, err
			}
		} else {
			f = resp.Files[0]
		}

		data, err := encodeDriveFile(f)
		if err != nil {
			return nil, err
		}
		store.cache[cacheKey] = data
		return f, nil
	}

	for _, pathSegment := range splitPath {
		f, err = store.ensureDirObj(pathSegment, parent)
		if err != nil {
			return nil, err
		}
		parent = f.Id
	}
	return f, nil
}

func decodeDriveFile(data []byte) (*drive.File, error) {
	if data == nil || len(data) == 0 {
		return nil, nil
	}
	var f *drive.File
	err := gob.NewDecoder(bytes.NewBuffer(data)).Decode(&f)
	return f, err
}

func encodeDriveFile(f *drive.File) ([]byte, error) {
	if f == nil {
		return nil, nil
	}
	buf := bytes.NewBuffer(nil)
	err := gob.NewEncoder(buf).Encode(f)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

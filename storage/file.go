package storage

import (
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"golang.org/x/sync/semaphore"
)

type fileStorage struct {
	directory string
	sem       *semaphore.Weighted
}

// NewFileStorage creates a new storage interface that can talk to the local filesystems
func NewFileStorage(directory string) (Storage, error) {
	if err := os.MkdirAll(directory, 0644); err != nil {
		log.Println("Could not create directory ("+directory+"): ", err)
		return nil, fmt.Errorf("Could not create directory (%s): %v", directory, err)
	}
	return &fileStorage{
		directory: directory,
		sem:       semaphore.NewWeighted(1),
	}, nil
}

// Exists returns true if the path refers to a file that exists on the local filesystem
func (store *fileStorage) Exists(path string) (bool, error) {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		log.Printf("Failed to acquire semaphore: %v", err)
		return false, err
	}
	defer store.sem.Release(1)
	fullPath := filepath.Join(store.directory, path)
	if _, err := os.Stat(fullPath); err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// EnsureDirectoryExists makes sure that the given directory exists, or it returns an error
func (store *fileStorage) EnsureDirectoryExists(path string) error {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		log.Printf("Failed to acquire semaphore: %v", err)
		return err
	}
	defer store.sem.Release(1)
	dir := filepath.Join(store.directory, path)
	if err := os.MkdirAll(dir, 0644); err != nil {
		log.Println("Could not create directory ("+dir+"): ", err)
		return fmt.Errorf("Could not create directory (%s): %v", dir, err)
	}
	return nil
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on the local filesystem, using a temporary file and renaming in the end in an idempotent way
func (store *fileStorage) DownloadFromURL(url, path string) error {
	// Allow the download to happen on any thread because its going into a temporary file
	log.Println("Downloading item", path)

	if err := store.EnsureDirectoryExists(filepath.Dir(path)); err != nil {
		return err
	}

	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	fullPath := filepath.Join(store.directory, path)

	tmpFile, err := ioutil.TempFile(filepath.Dir(fullPath), ".tmpdownload-")
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

	// There's no strong reason I can think of, but for good measure, let's gate the
	// final rename down to one-at-a-time using the semaphore
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		log.Printf("Failed to acquire semaphore: %v", err)
		return err
	}
	defer store.sem.Release(1)

	return os.Rename(tmpFile.Name(), fullPath)
}

// ReadBlob reads the file at the given path into memory and returns it as a slice of bytes
func (store *fileStorage) ReadBlob(path string) ([]byte, error) {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		log.Printf("Failed to acquire semaphore: %v", err)
		return nil, err
	}
	defer store.sem.Release(1)
	return ioutil.ReadFile(filepath.Join(store.directory, path))
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *fileStorage) WriteBlob(path string, blob []byte) error {
	if err := store.sem.Acquire(context.TODO(), 1); err != nil {
		log.Printf("Failed to acquire semaphore: %v", err)
		return err
	}
	defer store.sem.Release(1)
	return ioutil.WriteFile(filepath.Join(store.directory, path), blob, 0644)
}

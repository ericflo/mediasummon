package storage

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"reflect"
	"sort"
	"time"

	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/userconfig"
)

// Multi is a struct that binds together a group of storage interfaces, and
// writes to all of them, but reads only from a quorum of them (which, if they
// disagree, throws an error)
type Multi struct {
	Stores []Storage
	quorum int
	rnd    *rand.Rand
}

// URL returns an empty string for the multi. Maybe in the future we can come up with
// a scheme for encoding multiple urls within a url, maybe with query params or something.
func (m *Multi) URL() string {
	return ""
}

// Protocol returns the protocol of the url to this storage interface
func (m *Multi) Protocol() string {
	return "multi"
}

func (m *Multi) clippedQuorumCount() int {
	if m.quorum == 0 {
		m.quorum = 1
	}
	if len(m.Stores) < m.quorum {
		if len(m.Stores) == 0 {
			log.Println("Warning: looks like there are no sync targets configured")
		}
		return len(m.Stores)
	}
	return m.quorum
}

func (m *Multi) randomQuorum() []Storage {
	// If there's no random source for this multi struct, make one
	if m.rnd == nil {
		src := rand.NewSource(time.Now().Unix())
		m.rnd = rand.New(src)
	}

	// Go through and keep getting random array indices and fill the
	// sparse storage map up with the array values until it reaches the
	// specified count
	clippedQuorum := m.clippedQuorumCount()
	storageMap := make(map[int]Storage, clippedQuorum)
	for len(storageMap) < clippedQuorum {
		idx := m.rnd.Intn(len(m.Stores))
		if _, exists := storageMap[idx]; exists {
			continue
		}
		storageMap[idx] = m.Stores[idx]
	}

	// Take all the values from the storage map and make it into a slice to
	// return to the caller, because the map keys were just used to uniqueify
	resp := make([]Storage, 0, clippedQuorum)
	for _, store := range storageMap {
		resp = append(resp, store)
	}
	return resp
}

// Exists returns true if a quorum of stores say that the file exists
func (m *Multi) Exists(path string) (bool, error) {
	stores := m.randomQuorum()
	resps := make([]bool, len(stores))
	for i, store := range stores {
		value, err := store.Exists(path)
		if err != nil {
			return false, err
		}
		resps[i] = value
	}

	// Validate the responses, so if there's one value, there's nothing to check
	if len(resps) == 1 {
		return resps[0], nil
	} else if len(resps) == 0 {
		return false, nil
	}
	// But if there are multiple values, check them against each other
	for i := 0; i < len(resps)-1; i++ {
		first := resps[i]
		second := resps[i+1]
		if first != second {
			firstStore := stores[i]
			secondStore := stores[i+1]
			return false, fmt.Errorf("Mismatched storage: disagred, %v thought %v, but %v thought %v", firstStore, first, secondStore, second)
		}
	}

	return resps[0], nil
}

// EnsureDirectoryExists ensures the directory exists across all stores
func (m *Multi) EnsureDirectoryExists(path string) error {
	for _, store := range m.Stores {
		if err := store.EnsureDirectoryExists(path); err != nil {
			return err
		}
	}
	return nil
}

// DownloadFromURL downloads from a url to a path on each store
func (m *Multi) DownloadFromURL(url, path string) (string, error) {
	hsh := null.String{}
	for i, store := range m.Stores {
		hashValue, err := store.DownloadFromURL(url, path)
		if err != nil {
			return "", err
		}
		if hsh.Valid {
			if hsh.String != hashValue {
				firstStore := m.Stores[i-1]
				return "", fmt.Errorf("Mismatched storage: disagred, %v thought %v, but %v thought %v", firstStore, hsh.String, store, hashValue)
			}
		} else {
			hsh.SetValid(hashValue)
		}
	}
	if hsh.String == "" {
		return "", fmt.Errorf("Did not calculate checksum in even one storage backend of the %d checked", len(m.Stores))
	}
	return hsh.String, nil
}

// ReadBlob reads a blob from a random quorum of stores, makes sure they match, and then returns it
func (m *Multi) ReadBlob(path string) ([]byte, error) {
	stores := m.randomQuorum()
	resps := make([][]byte, len(stores))
	for i, store := range stores {
		value, err := store.ReadBlob(path)
		if err != nil {
			return nil, err
		}
		resps[i] = value
	}

	// Validate the responses, so if there's one value, there's nothing to check
	if len(resps) == 1 {
		return resps[0], nil
	} else if len(resps) == 0 {
		return nil, nil
	}
	// But if there are multiple values, check them against each other
	for i := 0; i < len(resps)-1; i++ {
		first := resps[i]
		second := resps[i+1]
		if !bytes.Equal(first, second) {
			firstStore := stores[i]
			secondStore := stores[i+1]
			return nil, fmt.Errorf("Mismatched storage: disagred, %v thought %v, but %v thought %v", firstStore, first, secondStore, second)
		}
	}

	return resps[0], nil
}

// WriteBlob writes a blob to all the stores
func (m *Multi) WriteBlob(path string, blob []byte) error {
	for _, store := range m.Stores {
		if err := store.WriteBlob(path, blob); err != nil {
			return err
		}
	}
	return nil
}

// ListDirectoryFiles gets a list of files from a random quorum of stores, makes sure they match, and
// then returns it
func (m *Multi) ListDirectoryFiles(path string) ([]string, error) {
	stores := m.randomQuorum()
	resps := make([][]string, len(stores))
	for i, store := range stores {
		value, err := store.ListDirectoryFiles(path)
		if err != nil {
			return nil, err
		}
		resps[i] = value
		sort.Strings(resps[i])
	}

	// Validate the responses, so if there's one value, there's nothing to check
	if len(resps) == 1 {
		return resps[0], nil
	} else if len(resps) == 0 {
		return nil, nil
	}
	// But if there are multiple values, check them against each other
	for i := 0; i < len(resps)-1; i++ {
		first := resps[i]
		second := resps[i+1]
		if !reflect.DeepEqual(first, second) {
			firstStore := stores[i]
			secondStore := stores[i+1]
			return nil, fmt.Errorf("Mismatched storage: disagred, %v thought %v, but %v thought %v", firstStore, first, secondStore, second)
		}
	}

	return resps[0], nil
}

// NeedsCredentials returns an error if any of its set of stores needs credentials
func (m *Multi) NeedsCredentials() error {
	for _, store := range m.Stores {
		if err := store.NeedsCredentials(); err != nil {
			return err
		}
	}
	return nil
}

////

// RemoveTarget removes a target represented by the given URL from the current set of stores
func (m *Multi) RemoveTarget(urlStr string) error {
	normalized := NormalizeStorageURL(urlStr)
	newStores := make([]Storage, 0, len(m.Stores)-1)
	found := false
	for _, store := range m.Stores {
		if store.URL() == normalized {
			found = true
			continue
		}
		newStores = append(newStores, store)
	}
	m.Stores = newStores
	if !found {
		return fmt.Errorf("Did not find url in sync target set: %s", urlStr)
	}
	return nil
}

// AddTarget adds a target to the current set of stores
func (m *Multi) AddTarget(userConfig *userconfig.UserConfig, urlStr string) error {
	store, err := NewStorageSingle(userConfig, urlStr)
	if err != nil {
		return err
	}
	m.Stores = append(m.Stores, store)
	// TODO: Copy all the data to the new storage drive before returning?
	return nil
}

// CredentialRedirectURL really makes no sense here, so we throw an error
func (m *Multi) CredentialRedirectURL() (string, error) {
	return "", errors.New("Multi does not support CredentialRedirectURL")
}

// AppCreateURL returns empty string for this interface
func (m *Multi) AppCreateURL() string {
	return ""
}

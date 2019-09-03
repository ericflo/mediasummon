package userconfig

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/storage"
)

// bCryptCost is the computational cost of the bcrypt algorithm
const bCryptCost = 12

// storageCache stores a cache of storage.Multi instances per config
var storageCache = map[string]*storage.Multi{}

// UserConfig is a struct that represents a user's configuration of Mediasummon
type UserConfig struct {
	Path string `json:"path"`

	Username     string    `json:"username"`
	PasswordHash string    `json:"password_hash"`
	Role         string    `json:"role"`
	TimeCreated  time.Time `json:"time_created"`

	Targets      []string           `json:"targets"`
	HoursPerSync map[string]float32 `json:"hours_per_sync"`

	Format      string `json:"format"`
	FrontendURL string `json:"frontend_url"`

	Secrets map[string]map[string]string `json:"secrets"`
}

// NewUserConfig takes a list of service names and returns a new default user config
func NewUserConfig(serviceNames []string) *UserConfig {
	hps := make(map[string]float32, len(serviceNames))
	secrets := make(map[string]map[string]string, len(serviceNames))
	for _, serviceName := range serviceNames {
		hps[serviceName] = constants.DefaultHoursPerSync
		switch serviceName {
		case "facebook", "google", "instagram":
			secrets[serviceName] = map[string]string{
				"ClientID":     "",
				"ClientSecret": "",
			}
			break
		default:
			secrets[serviceName] = map[string]string{}
		}
	}
	configPath := constants.DefaultUserConfigPath
	if absPath, err := filepath.Abs(configPath); err != nil {
		log.Println("Could not get absolute filename for", configPath, err, "...using non-abs version.")
	} else {
		configPath = absPath
	}
	return &UserConfig{
		Path:         configPath,
		Username:     "mediasummon",
		PasswordHash: "$2a$12$J0mZDHUs36dP7Chh5juN8OMp0Fe5I4y1ZTbuuBR4aeJx4pIdsJBDm", // Default password is 'admin'
		Role:         constants.DefaultUserRole,
		TimeCreated:  time.Now().UTC(),
		Targets:      []string{storage.NormalizeStorageURL("~/mediasummon")},
		Format:       strings.ReplaceAll("2006/January/02-15_04_05", "/", string(os.PathSeparator)),
		FrontendURL:  fmt.Sprintf("http://localhost:%s", constants.DefaultWebPort),
		HoursPerSync: hps,
		Secrets:      secrets,
	}
}

// LoadUserConfig loads the user config at the given path
func LoadUserConfig(configPath string) (*UserConfig, error) {
	encoded, err := ioutil.ReadFile(configPath)
	if err != nil {
		return nil, err
	}
	var config *UserConfig
	err = json.Unmarshal(encoded, &config)
	if err != nil {
		// Normalize storage target urls after successful load
		newTargets := make([]string, 0, len(config.Targets))
		for _, target := range config.Targets {
			newTargets = append(newTargets, storage.NormalizeStorageURL(target))
		}
		config.Targets = newTargets
	}
	return config, err
}

// LoadUserConfigs loads the user configs at the given paths, which defaults to
// a default user config if it doesn't exist
func LoadUserConfigs(configPaths []string, serviceNames []string) ([]*UserConfig, error) {
	userConfigs := make([]*UserConfig, 0, len(configPaths))
	for _, configPath := range configPaths {
		userConfig, err := LoadUserConfig(configPath)
		if err != nil {
			if !os.IsNotExist(err) {
				return nil, err
			}
			userConfig = NewUserConfig(serviceNames)
		}
		userConfigs = append(userConfigs, userConfig)
	}
	return userConfigs, nil
}

// Save persists a the sending UserConfig to disk
func (uc *UserConfig) Save() error {
	if uc.Path == "" {
		return fmt.Errorf("UserConfig cannot be saved: path is not set")
	}
	if err := os.MkdirAll(filepath.Dir(uc.Path), 0644); err != nil {
		return err
	}
	encoded, err := json.MarshalIndent(uc, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile(uc.Path, encoded, 0644)
}

// SetPassword sets the password hash to the hash of the given password
func (uc *UserConfig) SetPassword(password string) error {
	hsh, err := bcrypt.GenerateFromPassword([]byte(password), bCryptCost)
	if err != nil {
		return err
	}
	uc.PasswordHash = string(hsh)
	return nil
}

// CheckPassword checks whether the given password matches this account's password hash
func (uc *UserConfig) CheckPassword(password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(uc.PasswordHash), []byte(password))
	if err != nil {
		return errors.New("Password did not match user configuration")
	}
	return nil
}

// GetHoursPerSync gets the number of hours per sync for the requested service name, or
// the default if the requested service name has no registered amount
func (uc *UserConfig) GetHoursPerSync(serviceName string) float32 {
	if uc.HoursPerSync == nil {
		return constants.DefaultHoursPerSync
	}
	if h, exists := uc.HoursPerSync[serviceName]; exists {
		return h
	}
	return constants.DefaultHoursPerSync
}

// GetMultiStore instantiates, caches, and returns a *storage.Multi struct for this user config
func (uc *UserConfig) GetMultiStore() (*storage.Multi, error) {
	store, _ := storageCache[uc.Path]
	if store != nil {
		return store, nil
	}
	store, err := storage.NewStorage(uc.Targets)
	if err != nil || store == nil {
		return nil, fmt.Errorf("Could not initialize storage driver: %v", err)
	}
	storageCache[uc.Path] = store
	return store, nil
}

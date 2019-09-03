package services

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

// ErrNeedSecrets is the error returned when we can't find secrets for a service
var ErrNeedSecrets = errors.New("Could not find secrets for service")

// ErrNeedAuthentication is the error returned when we can't build an oauth client from what we have saved
var ErrNeedAuthentication = errors.New("We need permission to access this service on your behalf")

// ServiceCreator is a function that can create a sync service
type ServiceCreator func(serviceConfig *ServiceConfig) (SyncService, error)

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup(serviceConfig *ServiceConfig) error

	// Related to the service in general
	Metadata() *ServiceMetadata
	CurrentSyncData(userConfig *userconfig.UserConfig) *ServiceSyncData
	HTTPHandlers() map[string]http.HandlerFunc

	// Related to a single user run
	NeedsCredentials(userConfig *userconfig.UserConfig) bool
	CredentialRedirectURL(userConfig *userconfig.UserConfig) (string, error)
	AppCreateURL() string
	Sync(userConfig *userconfig.UserConfig, maxPages int) error
}

// ServiceMetadata is metadata that a service provides about itself
type ServiceMetadata struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ServiceConfig is a struct that can configure a service
type ServiceConfig struct {
	NumFetchers int64
	WebPort     string
	IsDebug     bool
	CSRFSecret  []byte
}

// ServiceSyncData is data about a single sync session performed by a service
type ServiceSyncData struct {
	UserConfigPath string            `json:"user_config_path"`
	Started        time.Time         `json:"start"`
	PageMax        int               `json:"page_max"`
	Ended          null.Time         `json:"end"`
	PageCurrent    null.Int          `json:"page_current"`
	ItemCount      null.Int          `json:"item_count"`
	SkipCount      null.Int          `json:"skip_count"`
	FailCount      null.Int          `json:"fail_count"`
	FetchCount     null.Int          `json:"fetch_count"`
	Hashes         map[string]string `json:"hashes"`
}

// NewServiceConfig creates a new service config with parameters read from the env
func NewServiceConfig() *ServiceConfig {
	sc := &ServiceConfig{}
	rewrite := false
	if err := godotenv.Load(".env"); err != nil && !os.IsNotExist(err) {
		log.Printf("Could not load .env file in current directory %v, writing default one", err)
		rewrite = true
	}

	numFetchersStr := GetenvDefault("NUM_FETCHERS", fmt.Sprintf("%d", constants.DefaultNumFetchers))
	numFetchers, err := strconv.ParseUint(numFetchersStr, 10, 64)
	if err != nil || numFetchers <= 0 {
		if err != nil {
			log.Println("Warning: Could not parse NUM_FETCHERS", err, "...defaulting to default", constants.DefaultNumFetchers)
		}
		sc.NumFetchers = constants.DefaultNumFetchers
	} else {
		sc.NumFetchers = int64(numFetchers)
	}
	sc.IsDebug = os.Getenv("IS_DEBUG") != ""
	sc.WebPort = GetenvDefault("PORT", constants.DefaultWebPort)
	sc.CSRFSecret, _ = base64.StdEncoding.DecodeString(os.Getenv("CSRF_SECRET"))
	if sc.CSRFSecret == nil || len(sc.CSRFSecret) == 0 {
		bSecret := make([]byte, 32)
		if _, err := rand.Read(bSecret); err != nil {
			log.Println("Error getting randomness for secret")
		}
		sc.CSRFSecret = bSecret
		rewrite = true
	}

	if rewrite {
		debugStr := ""
		if sc.IsDebug {
			debugStr += "false"
		}
		encoded, err := godotenv.Marshal(map[string]string{
			"IS_DEBUG":                debugStr,
			"CSRF_SECRET":             base64.StdEncoding.EncodeToString(sc.CSRFSecret),
			"NUM_FETCHERS":            fmt.Sprintf("%d", numFetchers),
			"GOOGLE_CLIENT_ID":        "",
			"GOOGLE_CLIENT_SECRET":    "",
			"FACEBOOK_CLIENT_ID":      "",
			"FACEBOOK_CLIENT_SECRET":  "",
			"INSTAGRAM_CLIENT_ID":     "",
			"INSTAGRAM_CLIENT_SECRET": "",
		})
		if err != nil {
			log.Println("Could not encode new .env dotfile for writing", err)
		} else {
			if err = ioutil.WriteFile(".env", []byte(encoded), 0644); err != nil {
				log.Println("Could not write out new .env dotfile", err)
			}
		}
	}

	return sc
}

// displayErrorPage writes a basic text error message to the http response
func displayErrorPage(w http.ResponseWriter, msg string) {
	w.Write([]byte("Error: " + msg))
}

func saveOAuthData(userConfig *userconfig.UserConfig, serviceName string, tok *oauth2.Token) error {
	secrets, _ := userConfig.Secrets[serviceName]
	if secrets == nil {
		secrets = map[string]string{}
	}
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode authentication token to save: %v", err)
	}
	secrets["Token"] = string(encodedTok)
	userConfig.Secrets[serviceName] = secrets
	return userConfig.Save()
}

func loadOAuthData(userConfig *userconfig.UserConfig, serviceName string) (*oauth2.Token, error) {
	secrets, _ := userConfig.Secrets[serviceName]
	if secrets == nil {
		return nil, nil
	}
	var tok *oauth2.Token
	var err error
	if encodedToken, exists := secrets["Token"]; exists {
		err = json.Unmarshal([]byte(encodedToken), &tok)
	}
	return tok, err
}

func getServiceAppSecret(userConfig *userconfig.UserConfig, serviceName, secretName, backup string) (secret string, err error) {
	secrets, _ := userConfig.Secrets[serviceName]
	if secrets != nil {
		if sec, exists := secrets[secretName]; exists {
			secret = sec
		}
	}
	if secret == "" {
		secret = os.Getenv(backup)
	}
	if secret == "" {
		err = ErrNeedSecrets
	}
	return
}

func oAuth2Conf(userConfig *userconfig.UserConfig, serviceName string, endpoint oauth2.Endpoint, scopes []string) (*oauth2.Config, error) {
	caps := strings.ToUpper(serviceName)
	clientID, err := getServiceAppSecret(userConfig, serviceName, "ClientID", caps+"_CLIENT_ID")
	if err != nil {
		return nil, err
	}
	clientSecret, err := getServiceAppSecret(userConfig, serviceName, "ClientSecret", caps+"_CLIENT_SECRET")
	if err != nil {
		return nil, err
	}

	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  userConfig.FrontendURL + "/auth/" + serviceName + "/return",
		Scopes:       scopes,
		Endpoint:     endpoint,
	}, nil
}

func oAuth2Client(userConfig *userconfig.UserConfig, serviceName string, endpoint oauth2.Endpoint, scopes []string) (*http.Client, error) {
	oauthConf, err := oAuth2Conf(userConfig, serviceName, endpoint, scopes)
	if err != nil {
		return nil, err
	}
	tok, err := loadOAuthData(userConfig, serviceName)
	if err != nil {
		return nil, err
	}
	if tok == nil {
		return nil, ErrNeedAuthentication
	}
	return oauthConf.Client(oauth2.NoContext, tok), nil
}

func persistSyncData(store storage.Storage, serviceName string, syncData *ServiceSyncData) error {
	encoded, err := json.MarshalIndent(syncData, "", "  ")
	if err != nil {
		log.Printf("Error: Could not encode data to save: %v", err)
		return fmt.Errorf("Could not encode data to save: %v", err)
	}
	datadir := filepath.Join(".meta", serviceName, "syncdata")
	if err = store.EnsureDirectoryExists(datadir); err != nil {
		log.Printf("Error: Could not create syncdata directory: %v", err)
		return fmt.Errorf("Could not create syncdata directory: %v", err)
	}
	path := filepath.Join(datadir, fmt.Sprintf("%d.json", syncData.Started.UnixNano()))
	if err = store.WriteBlob(path, encoded); err != nil {
		log.Printf("Error: Could not write sync data to disk: %v", err)
		return fmt.Errorf("Could not write sync data to disk: %v", err)
	}
	return nil
}

func handleSyncError(store storage.Storage, serviceName string, syncData *ServiceSyncData, count int) error {
	syncData.FailCount = incrementOrSet(syncData.FailCount, count)
	return persistSyncData(store, serviceName, syncData)
}

func persistSyncDataPostFetch(store storage.Storage, serviceName string, syncData *ServiceSyncData, fetchErr error, filePath, hash string) {
	if fetchErr == nil {
		syncData.FetchCount = incrementOrSet(syncData.FetchCount, 1)
		syncData.Hashes[filePath] = hash
		persistSyncData(store, serviceName, syncData)
	} else {
		syncData.FailCount = incrementOrSet(syncData.FailCount, 1)
		persistSyncData(store, serviceName, syncData)
	}
}

// ListServiceSyncDataPaths lists the paths to the ServiceSyncData
func ListServiceSyncDataPaths(userConfig *userconfig.UserConfig, serviceName string) ([]string, []int64, error) {
	store, err := userConfig.GetMultiStore()
	if err != nil {
		return nil, nil, err
	}
	names, err := store.ListDirectoryFiles(filepath.Join(".meta", serviceName, "syncdata"))
	if err != nil {
		return nil, nil, err
	}
	paths := make([]string, 0, len(names))
	values := make([]int64, 0, len(names))
	for _, filePath := range names {
		if !strings.HasSuffix(filePath, ".json") {
			continue
		}
		name := filepath.Base(filePath)
		// Check that it parses as a number
		value, err := strconv.ParseInt(strings.TrimSuffix(name, ".json"), 10, 64)
		if err != nil {
			continue
		}
		paths = append(paths, filePath)
		values = append(values, value)
	}
	return paths, values, nil
}

// GetLatestServiceSyncData gets the latest ServiceSyncData for the given service
func GetLatestServiceSyncData(userConfig *userconfig.UserConfig, serviceName string) (*ServiceSyncData, error) {
	paths, values, err := ListServiceSyncDataPaths(userConfig, serviceName)
	largestPath := ""
	largestValue := int64(-1)
	for i, dataPath := range paths {
		if values[i] > largestValue {
			largestPath = dataPath
			largestValue = values[i]
		}
	}
	if largestValue == int64(-1) {
		return nil, nil
	}
	store, err := userConfig.GetMultiStore()
	if err != nil {
		return nil, err
	}
	blob, err := store.ReadBlob(largestPath)
	if err != nil {
		return nil, err
	}
	syncData := &ServiceSyncData{}
	if err = json.Unmarshal(blob, &syncData); err != nil {
		return nil, err
	}
	return syncData, nil
}

// GetenvDefault gets an environment, but defaults to the parameter given if none is found
func GetenvDefault(name string, def string) string {
	ret := os.Getenv(name)
	if ret == "" {
		return def
	}
	return ret
}

// incrementOrSet either increments a null.Int value by the value, or creates a valid one from it
func incrementOrSet(toSet null.Int, val int) null.Int {
	if toSet.Valid {
		toSet.Int64 += int64(val)
		return toSet
	}
	return null.IntFrom(int64(val))
}

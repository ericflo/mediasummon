package services

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"gopkg.in/guregu/null.v3"
	"maxint.co/mediasummon/constants"
)

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
	sc.IsDebug = os.Getenv("IS_DEBUG") == "true"
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
			debugStr += "true"
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

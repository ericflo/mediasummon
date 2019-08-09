package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// GoogleClientID is the ID of the account that will be used with the Google Photos API
var GoogleClientID string

// GoogleClientSecret is the secret of the account that will be used with the Google Photos API
var GoogleClientSecret string

// InstagramClientID is the ID of the account that will be used with the Instagram API
var InstagramClientID string

// InstagramClientSecret is the secret of the account that will be used with the Instagram API
var InstagramClientSecret string

// WebPort is the port that the web server should start on
var WebPort string

// FrontendURL is the URL to access the web port from the perspective of the end-user
var FrontendURL string

// GetenvDefault gets an environment, but defaults to the parameter given if none is found
func GetenvDefault(name string, def string) string {
	ret := os.Getenv(name)
	if ret == "" {
		return def
	}
	return ret
}

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Printf("Did not find .env file: %v", err)
	}
	GoogleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	GoogleClientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	InstagramClientID = os.Getenv("INSTAGRAM_CLIENT_ID")
	InstagramClientSecret = os.Getenv("INSTAGRAM_CLIENT_SECRET")
	WebPort = GetenvDefault("WEB_PORT", "5000")
	FrontendURL = GetenvDefault("FRONTEND_URL", "http://localhost:"+WebPort)
}

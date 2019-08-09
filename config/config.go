package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var GoogleClientID string
var GoogleClientSecret string
var WebPort string
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
	WebPort = GetenvDefault("WEB_PORT", "5000")
	FrontendURL = GetenvDefault("FRONTEND_URL", "http://localhost:"+WebPort)
}

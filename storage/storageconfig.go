package storage

import "os"

// ConfigS3 is a struct that can configure an S3 storage interface
type ConfigS3 struct {
	Region             string `json:"region"`
	AWSAccessKeyID     string `json:"aws_access_key_id"`
	AWSSecretAccessKey string `json:"aws_secret_access_key"`
}

// ConfigOAuth is a struct that can configure an OAuth storage interface
type ConfigOAuth struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	Token        string `json:"token"`
}

// Config is a struct that can configure a storage interface
type Config struct {
	S3      *ConfigS3    `json:"s3"`
	Dropbox *ConfigOAuth `json:"dropbox"`
	GDrive  *ConfigOAuth `json:"gdrive"`
}

// NewConfig creates and returns an empty storage config
func NewConfig() *Config {
	return &Config{
		S3:      &ConfigS3{},
		Dropbox: &ConfigOAuth{},
		GDrive:  &ConfigOAuth{},
	}
}

func secretOrEnv(secret, backup string) string {
	if secret == "" {
		secret = os.Getenv(backup)
	}
	return secret
}

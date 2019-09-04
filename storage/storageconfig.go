package storage

// ConfigS3 is a struct that can configure an S3 storage interface
type ConfigS3 struct {
	Bucket             string `json:"bucket"`
	Region             string `json:"region"`
	AWSAccessKeyID     string `json:"aws_access_key_id"`
	AWSSecretAccessKey string `json:"aws_secret_access_key"`
}

// Config is a struct that can configure a storage interface
type Config struct {
	S3 *ConfigS3 `json:"S3"`
}

// NewConfig creates and returns an empty storage config
func NewConfig() *Config {
	return &Config{
		S3: &ConfigS3{},
	}
}

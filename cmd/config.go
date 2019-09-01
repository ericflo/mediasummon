package cmd

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

const defaultConfigPath = "mediasummon.config.json"

type commandConfig struct {
	Targets     []string `json:"targets"`
	AdminPath   string   `json:"admin_path"`
	Format      string   `json:"format"`
	NumFetchers int64    `json:"num_fetchers"`
	MaxPages    int      `json:"max_pages"`
	WebPort     string   `json:"web_port"`
}

func (config *commandConfig) ApplyToServiceConfig(serviceConfig *services.ServiceConfig) {
	serviceConfig.AdminPath = config.AdminPath
	serviceConfig.Format = config.Format
	serviceConfig.NumFetchers = config.NumFetchers
	serviceConfig.MaxPages = config.MaxPages
	serviceConfig.WebPort = config.WebPort
}

func makeDefaultCommandConfig() *commandConfig {
	return &commandConfig{
		Targets:     []string{storage.NormalizeStorageURL("media")},
		AdminPath:   "admin",
		Format:      strings.ReplaceAll("2006/January/02-15_04_05", "/", string(os.PathSeparator)),
		NumFetchers: 6,
		MaxPages:    0,
		WebPort:     "5000",
	}
}

func getTargetConfigPath() string {
	var configPath string
	flag.StringVar(&configPath, "config", defaultConfigPath, "path to config file")
	flag.StringVar(&configPath, "c", defaultConfigPath, "path to config file [shorthand]")
	flag.Parse()
	return configPath
}

func readConfig(configPath string) (*commandConfig, error) {
	encoded, err := ioutil.ReadFile(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			return makeDefaultCommandConfig(), nil
		}
		return nil, err
	}
	var config *commandConfig
	err = json.Unmarshal(encoded, &config)
	return config, err
}

func writeConfig(configPath string, config *commandConfig) error {
	if err := os.MkdirAll(filepath.Dir(configPath), 0644); err != nil {
		return err
	}
	encoded, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return err
	}
	return ioutil.WriteFile(configPath, encoded, 0644)
}

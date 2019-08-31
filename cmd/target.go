package cmd

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

const defaultConfigPath = "mediasummon.config.json"

var defaultConfig = &commandConfig{
	Targets:     []string{storage.NormalizeStorageURL("media")},
	AdminPath:   "admin",
	Format:      strings.ReplaceAll("2006/January/02-15_04_05", "/", string(os.PathSeparator)),
	NumFetchers: 6,
	MaxPages:    0,
	WebPort:     "5000",
}

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

// RunTargetAdd runs an 'target add' command which adds a new sync target to the list
func RunTargetAdd() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to add, i.e. 'target add path/to/my/folder'")
		return
	}
	target := os.Args[1]
	configPath := getTargetConfigPath()
	if err := addTarget(configPath, target); err != nil {
		log.Println("Could not add to target:", err)
		return
	}
	printTargetList(configPath)
}

// RunTargetRemove runs a 'target remove' command which removes a sync target from the list
func RunTargetRemove() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to remove, i.e. 'target remove path/to/my/folder'")
		return
	}
	target := os.Args[1]
	configPath := getTargetConfigPath()
	if err := removeTarget(configPath, target); err != nil {
		log.Println("Could not remove from target:", err)
		return
	}
	printTargetList(configPath)
}

// RunTargetList runs a 'target list' command which lists the current sync targets from the list
func RunTargetList() {
	configPath := getTargetConfigPath()
	printTargetList(configPath)
}

func printTargetList(configPath string) {
	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}
	for i, target := range config.Targets {
		unescaped, err := url.PathUnescape(storage.NormalizeStorageURL(target))
		if err != nil {
			log.Printf("%d) %s {error: %v}", i+1, target, err)
		} else {
			log.Printf("%d) %s", i+1, unescaped)
		}
	}
}

func addTarget(configPath, target string) error {
	target = storage.NormalizeStorageURL(target)

	store, err := storage.NewStorageSingle(target)
	if err != nil {
		return fmt.Errorf("Invalid sync target %v", err)
	}

	// First read in the current config
	config, err := readConfig(configPath)
	if err != nil {
		return fmt.Errorf("Error reading config %v", err)
	}

	// Check whether the target is already in the list
	sort.Strings(config.Targets)
	idx := sort.SearchStrings(config.Targets, target)
	exists := idx < len(config.Targets) && config.Targets[idx] == target
	// If it exists already, it's an error
	if exists {
		return fmt.Errorf("Cannot add target, it's there already %v", target)
	}
	// Otherwise, add it
	config.Targets = append(config.Targets, store.URL())
	sort.Strings(config.Targets)

	// Write the config back out
	err = writeConfig(configPath, config)
	if err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
}

func removeTarget(configPath, target string) error {
	target = storage.NormalizeStorageURL(target)

	// First read in the current config
	config, err := readConfig(configPath)
	if err != nil {
		return fmt.Errorf("Error reading config %v", err)
	}

	// Check whether the target is already in the list
	sort.Strings(config.Targets)
	idx := sort.SearchStrings(config.Targets, target)
	exists := idx < len(config.Targets) && config.Targets[idx] == target
	if exists {
		// If it does, remove it
		config.Targets = append(config.Targets[:idx], config.Targets[idx+1:]...)
	}

	// Write the config back out
	err = writeConfig(configPath, config)
	if err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
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
			return defaultConfig, nil
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

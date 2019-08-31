package cmd

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
)

const defaultConfigPath = "mediasummon.config.json"

var defaultConfig = &commandConfig{Targets: []string{"media"}}

type commandConfig struct {
	Targets []string `json:"targets"`
}

// RunTargetAdd runs an 'target add' command which adds a new sync target to the list
func RunTargetAdd() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to add, i.e. 'target add path/to/my/folder'")
		return
	}
	target := os.Args[1]

	// First read in the current config
	configPath := getTargetConfigPath()
	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}

	// Check whether the target is already in the list
	sort.Strings(config.Targets)
	idx := sort.SearchStrings(config.Targets, target)
	if idx == len(config.Targets) {
		// If not, add it
		config.Targets = append(config.Targets, target)
	}

	// Write the config back out
	err = writeConfig(configPath, config)
	if err != nil {
		log.Println("Error writing new config")
	}

	printTargetList(config)
}

// RunTargetRemove runs a 'target remove' command which removes a sync target from the list
func RunTargetRemove() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to remove, i.e. 'target remove path/to/my/folder'")
		return
	}
	target := os.Args[1]

	// First read in the current config
	configPath := getTargetConfigPath()
	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}

	// Check whether the target is already in the list
	sort.Strings(config.Targets)
	idx := sort.SearchStrings(config.Targets, target)
	if idx != len(config.Targets) {
		// If it is, remove it
		config.Targets = append(config.Targets[:idx], config.Targets[idx+1:]...)
	}

	// Write the config back out
	err = writeConfig(configPath, config)
	if err != nil {
		log.Println("Error writing new config")
	}

	printTargetList(config)
}

// RunTargetList runs a 'target list' command which lists the current sync targets from the list
func RunTargetList() {
	configPath := getTargetConfigPath()
	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config:", err)
		return
	}
	printTargetList(config)
}

func printTargetList(config *commandConfig) {
	for i, target := range config.Targets {
		log.Printf("%d) %s", i+1, target)
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
	encoded, err := json.Marshal(config)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(configPath, encoded, 0644)
}

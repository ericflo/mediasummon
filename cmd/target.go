package cmd

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"sort"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

// RunTargetAdd runs an 'target add' command which adds a new sync target to the list
func RunTargetAdd() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to add, i.e. 'EXE target add path/to/my/folder'")
		return
	}
	configPath := getTargetConfigPath()
	runTargetPreamble(configPath)
	if err := addTarget(configPath, os.Args[1]); err != nil {
		log.Println("Could not add to target:", err)
		return
	}
	printTargetList(configPath)
}

// RunTargetRemove runs a 'target remove' command which removes a sync target from the list
func RunTargetRemove() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to remove, i.e. 'EXE target remove path/to/my/folder'")
		return
	}
	configPath := getTargetConfigPath()
	runTargetPreamble(configPath)
	if err := removeTarget(configPath, os.Args[1]); err != nil {
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

func runTargetPreamble(configPath string) {
	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}
	serviceConfig := &services.ServiceConfig{}
	config.ApplyToServiceConfig(serviceConfig)
	store, err := storage.NewStorage(config.Targets)
	if err != nil || store == nil {
		log.Println("FATAL: Could not initialize storage driver", err)
		return
	}
	serviceConfig.Storage = store
	serviceConfig.LoadFromEnv()
	populateServiceMap(serviceConfig)
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

func fullyNormalizeTarget(target string) (string, error) {
	// First we normalize our new target into a full URL with scheme prefix and everything
	target = storage.NormalizeStorageURL(target)

	// Now we parse that URL, and check to make sure that it passes basic sanity checks
	parsedURL, err := url.Parse(target)
	if err != nil {
		return target, err
	} else if parsedURL.Path == "" || (parsedURL.Scheme == "file" && parsedURL.Path == "/") {
		return target, fmt.Errorf("Invalid target URL: must have a path. (%v)", target)
	}

	// Now we actually instantiate a storage engine based on it to make sure it doesn't error out
	store, err := storage.NewStorageSingle(target)
	if err != nil {
		return target, fmt.Errorf("Invalid sync target %v", err)
	}

	return store.URL(), nil
}

func addTarget(configPath, target string) error {
	target, err := fullyNormalizeTarget(target)
	if err != nil {
		return err
	}

	// Good, we now trust the target, let's add it...

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
	config.Targets = append(config.Targets, target)
	sort.Strings(config.Targets)

	// Write the config back out
	err = writeConfig(configPath, config)
	if err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
}

func removeTarget(configPath, target string) error {
	target, err := fullyNormalizeTarget(target)
	if err != nil {
		return err
	}

	// First read in the current config
	config, err := readConfig(configPath)
	if err != nil {
		return fmt.Errorf("Error reading config %v", err)
	}

	var next []string
	for i, v := range config.Targets {
		if v == target {
			next = append(config.Targets[:i], config.Targets[i+1:]...)
			break
		}
	}
	if next == nil {
		return fmt.Errorf("There was no target %v in targets %v", target, config.Targets)
	}
	config.Targets = next

	// Write the config back out
	if err = writeConfig(configPath, config); err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
}

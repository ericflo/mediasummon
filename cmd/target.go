package cmd

import (
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"sort"
	"strings"

	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

const defaultDefaultTarget = "~/mediasummon" // lol, the default's default
const disabledTarget = "disabled"

func getDefaultTargets() []string {
	defaultTarget := os.Getenv("DEFAULT_TARGET")
	if defaultTarget == "" {
		defaultTarget = defaultDefaultTarget
	} else if strings.ToLower(defaultTarget) == disabledTarget {
		return []string{}
	}
	return []string{storage.NormalizeStorageURL(defaultTarget)}
}

func getTargetConfigPath() string {
	var configPath string
	flag.StringVar(&configPath, "config", constants.DefaultUserConfigPath, "path to config file")
	flag.StringVar(&configPath, "c", constants.DefaultUserConfigPath, "path to config file [shorthand]")
	flag.Parse()
	return configPath
}

// RunTargetAdd runs an 'target add' command which adds a new sync target to the list
func RunTargetAdd() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to add, i.e. 'EXE target add path/to/my/folder'")
		return
	}
	configPath := getTargetConfigPath()
	userConfig, err := runTargetPreamble(configPath)
	if err != nil {
		log.Println("Could not run target preamble:", err)
		return
	}
	if err := addTarget(userConfig, os.Args[1]); err != nil {
		log.Println("Could not add to target:", err)
		return
	}
	printTargetList(userConfig)
}

// RunTargetRemove runs a 'target remove' command which removes a sync target from the list
func RunTargetRemove() {
	if len(os.Args) < 2 {
		log.Println("Must include a target to remove, i.e. 'EXE target remove path/to/my/folder'")
		return
	}
	configPath := getTargetConfigPath()
	userConfig, err := runTargetPreamble(configPath)
	if err != nil {
		log.Println("Could not run target preamble:", err)
		return
	}
	if err := removeTarget(userConfig, os.Args[1]); err != nil {
		log.Println("Could not remove from target:", err)
		return
	}
	printTargetList(userConfig)
}

// RunTargetList runs a 'target list' command which lists the current sync targets from the list
func RunTargetList() {
	configPath := getTargetConfigPath()
	userConfig, err := runTargetPreamble(configPath)
	if err != nil {
		log.Println("Could not run target preamble:", err)
		return
	}
	printTargetList(userConfig)
}

func runTargetPreamble(configPath string) (*userconfig.UserConfig, error) {
	serviceConfig := services.NewServiceConfig()
	populateServiceMap(serviceConfig)
	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			userConfig = userconfig.NewUserConfig(sortedServiceNames(), getDefaultTargets())
		} else {
			log.Println("Error reading config", err)
			return nil, err
		}
	}
	return userConfig, nil
}

func printTargetList(userConfig *userconfig.UserConfig) {
	for i, target := range userConfig.Targets {
		log.Printf("%d) %s", i+1, target)
	}
}

func fullyNormalizeTarget(userConfig *userconfig.UserConfig, target string) (string, error) {
	// First we normalize our new target into a full URL with scheme prefix and everything
	target = storage.NormalizeStorageURL(target)

	// Now we parse that URL, and check to make sure that it passes basic sanity checks
	parsedURL, err := url.Parse(target)
	if err != nil {
		return target, err
	} else if parsedURL.Scheme == "file" && parsedURL.Path == "/" {
		return target, fmt.Errorf("Invalid target URL: must have a path. (%v)", target)
	}

	// Now we actually instantiate a storage engine based on it to make sure it doesn't error out
	store, err := storage.NewStorageSingle(userConfig, target)
	if err != nil {
		return target, fmt.Errorf("Invalid sync target %v", err)
	}

	return store.URL(), nil
}

func addTarget(userConfig *userconfig.UserConfig, target string) error {
	target, err := fullyNormalizeTarget(userConfig, target)
	if err != nil {
		return err
	}

	// Good, we now trust the target, let's add it...

	// Check whether the target is already in the list
	sort.Strings(userConfig.Targets)
	idx := sort.SearchStrings(userConfig.Targets, target)
	exists := idx < len(userConfig.Targets) && userConfig.Targets[idx] == target
	// If it exists already, it's an error
	if exists {
		return fmt.Errorf("Cannot add target, it's there already %v", target)
	}
	// Otherwise, add it
	userConfig.Targets = append(userConfig.Targets, target)
	sort.Strings(userConfig.Targets)

	// Write the config back out
	err = userConfig.Save()
	if err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
}

func removeTarget(userConfig *userconfig.UserConfig, target string) error {
	target, err := fullyNormalizeTarget(userConfig, target)
	if err != nil {
		return err
	}

	var next []string
	for i, v := range userConfig.Targets {
		if v == target {
			next = append(userConfig.Targets[:i], userConfig.Targets[i+1:]...)
			break
		}
	}
	if next == nil {
		return fmt.Errorf("There was no target %v in targets %v", target, userConfig.Targets)
	}
	userConfig.Targets = next

	// Write the config back out
	if err = userConfig.Save(); err != nil {
		return fmt.Errorf("Error writing new config %v", err)
	}
	return nil
}

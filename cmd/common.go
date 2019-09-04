package cmd

import (
	"log"
	"sort"
	"strings"

	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/services"
)

var serviceCreatorMap map[string]services.ServiceCreator = map[string]services.ServiceCreator{
	"google":    services.NewGoogleService,
	"instagram": services.NewInstagramService,
	"facebook":  services.NewFacebookService,
}
var serviceMap = map[string]services.SyncService{}

type configPathsFlags []string

func (i *configPathsFlags) String() string {
	return "[" + strings.Join(i.Strings(), ", ") + "]"
}

func (i *configPathsFlags) Strings() []string {
	val := *i
	if val == nil {
		val = []string{constants.DefaultUserConfigPath}
	} else if len(val) == 0 {
		val = append(val, constants.DefaultUserConfigPath)
	}
	return val
}

func (i *configPathsFlags) Set(value string) error {
	*i = append(*i, value)
	return nil
}

// populateServiceMap populates the service map with the initialized SyncService given the
// provided ServiceConfig
func populateServiceMap(serviceConfig *services.ServiceConfig) {
	for serviceName, svcCreator := range serviceCreatorMap {
		var svc services.SyncService
		if s, err := svcCreator(serviceConfig); err != nil {
			log.Println("Error setting up", serviceName, err, "...skipping.")
			continue
		} else {
			svc = s
		}
		serviceMap[serviceName] = svc
	}
}

// sortedServiceNames returns a sorted list of the service names registered to the serviceMap
func sortedServiceNames() []string {
	serviceNames := make([]string, 0, len(serviceMap))
	for serviceName := range serviceMap {
		serviceNames = append(serviceNames, serviceName)
	}
	sort.Strings(serviceNames)
	return serviceNames
}

// serviceOptions gets a slice of all the keys in the serviceMap, plus the "all" option
func serviceOptions() []string {
	serviceOptionList := []string{"all"}
	for name := range serviceMap {
		serviceOptionList = append(serviceOptionList, name)
	}
	return serviceOptionList
}

// sortedProtocols returns a sorted list of supported protocols
func sortedProtocols(serviceConfig *services.ServiceConfig) []string {
	// TODO: whitelist/blacklist using a new property we introduce in serviceConfig?
	protocols := []string{"file", "s3"}
	sort.Strings(protocols)
	return protocols
}

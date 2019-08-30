package cmd

import (
	"log"
	"sort"

	"maxint.co/mediasummon/services"
)

var serviceCreatorMap map[string]services.ServiceCreator = map[string]services.ServiceCreator{
	"google":    services.NewGoogleService,
	"instagram": services.NewInstagramService,
	"facebook":  services.NewFacebookService,
}
var serviceMap = map[string]services.SyncService{}

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

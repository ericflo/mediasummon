package cmd

import (
	"flag"
	"log"
	"net/http"
	"strings"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

const defaultServiceName = "all"
const defaultHoursPerSync = 24

// RunSync runs a 'sync' command line application that syncs a service to a directory
func RunSync() {
	serviceOptions := strings.Join(serviceOptions(), ", ")
	var configPath string
	var serviceName string
	serviceConfig := &services.ServiceConfig{}

	flag.StringVar(&configPath, "config", defaultConfigPath, "path to config file")
	flag.StringVar(&configPath, "c", defaultConfigPath, "path to config file [shorthand]")
	flag.StringVar(&serviceName, "service", defaultServiceName, "which service to sync ("+serviceOptions+")")
	flag.StringVar(&serviceName, "s", defaultServiceName, "which service to sync ("+serviceOptions+") [shorthand]")
	flag.Parse()

	config, err := readConfig(configPath)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}
	config.ApplyToServiceConfig(serviceConfig)

	store, err := storage.NewStorage(config.Targets)
	if err != nil || store == nil {
		log.Println("FATAL: Could not initialize storage driver", err)
		return
	}
	serviceConfig.Storage = store

	serviceConfig.LoadFromEnv()

	populateServiceMap(serviceConfig)

	if serviceName == "all" {
		runSyncList(configPath, serviceConfig)
	} else {
		runSyncService(serviceName, configPath, serviceConfig)
	}
}

// runSyncList runs sync on all the services that have credentials
func runSyncList(configPath string, serviceConfig *services.ServiceConfig) {
	svcs := map[string]services.SyncService{}
	mux := http.NewServeMux()
	for serviceName, svc := range serviceMap {
		if svc.NeedsCredentials() {
			log.Println("Service", serviceName, "needs credentials...skipping.")
			continue
		}
		svcs[serviceName] = svc
		for key, handler := range svc.HTTPHandlers() {
			mux.HandleFunc(key, handler)
		}
	}

	handler, err := attachAdminHTTPHandlers(mux, configPath, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach admin HTTP handlers", err)
	}
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)

	i := 1
	for serviceName, svc := range svcs {
		log.Println("Running sync for", serviceName, "(", i, "/", len(svcs), ")")
		if err := svc.Sync(); err != nil {
			log.Println("Error syncing", serviceName, err)
			return
		}
		i++
	}
}

// runSyncService runs sync for an individual service, requesting credentials from the user if needed
func runSyncService(serviceName, configPath string, serviceConfig *services.ServiceConfig) {
	svc, exists := serviceMap[serviceName]
	if !exists {
		log.Println("Could not find service: " + serviceName)
		return
	}

	mux := http.NewServeMux()
	for key, handler := range svc.HTTPHandlers() {
		mux.HandleFunc(key, handler)
	}

	handler, err := attachAdminHTTPHandlers(mux, configPath, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach admin HTTP handlers", err)
	}
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)

	if err := svc.Sync(); err != nil {
		log.Println("Error syncing", serviceName, err)
	}
}

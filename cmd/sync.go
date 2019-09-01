package cmd

import (
	"flag"
	"log"
	"net/http"
	"strings"
	"time"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

const defaultServiceName = "all"
const defaultHoursPerSync = 24.0
const defaultDurationBetweenSyncChecks = time.Duration(time.Second * 5)

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
		runSyncList(configPath, config, serviceConfig)
	} else {
		runSyncService(serviceName, configPath, config, serviceConfig)
	}
}

// runSyncList runs sync on all the services that have credentials
func runSyncList(configPath string, config *commandConfig, serviceConfig *services.ServiceConfig) {
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

	handler, err := attachAdminHTTPHandlers(mux, configPath, config, serviceConfig)
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
func runSyncService(serviceName, configPath string, config *commandConfig, serviceConfig *services.ServiceConfig) {
	svc, exists := serviceMap[serviceName]
	if !exists {
		log.Println("Could not find service: " + serviceName)
		return
	}

	mux := http.NewServeMux()
	for key, handler := range svc.HTTPHandlers() {
		mux.HandleFunc(key, handler)
	}

	handler, err := attachAdminHTTPHandlers(mux, configPath, config, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach admin HTTP handlers", err)
	}
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)

	if err := svc.Sync(); err != nil {
		log.Println("Error syncing", serviceName, err)
	}
}

// runScheduledServiceSync loops over every service that has credentials, and
// if any one is ready for a new sync, starts a goroutine to sync it
func runScheduledServiceSync(store *storage.Multi, config *commandConfig) error {
	// Loop over very service in the service map
	for serviceName, service := range serviceMap {
		if service.NeedsCredentials() {
			continue
		}

		// Get the last sync
		lastSync, err := services.GetLatestServiceSyncData(store, serviceName)
		if err != nil {
			log.Println("Error getting latest service sync data", err)
			return err
		}

		// If we haven't synced before, we know we can sync right away
		if lastSync == nil {
			go service.Sync()
			continue
		}

		// If the last sync didn't ever end,
		if !lastSync.Ended.Valid {
			// If we're not currently running a sync for it, start one
			if service.CurrentSyncData() == nil {
				go service.Sync()
			}
			// Either way, either we were running a sync or we're running one now,
			// so let's continue on
			continue
		}

		// Now we need to see what our configured sync time is
		hours := config.GetHoursPerSync(serviceName)
		nextSyncTime := lastSync.Ended.Time.Add(time.Hour * time.Duration(hours))

		// If it's after now, start up a sync and continue on
		if time.Now().UTC().After(nextSyncTime) {
			go service.Sync()
			continue
		}
	}

	return nil
}

// runServiceSyncLoop runs runScheduledServiceSync in a loop, reporting any errors to the console, and
// waiting a configurable duration between checks
func runServiceSyncLoop(store *storage.Multi, config *commandConfig) {
	for {
		if err := runScheduledServiceSync(store, config); err != nil {
			log.Println("Error running scheduled service sync:", err)
		}
		time.Sleep(defaultDurationBetweenSyncChecks)
	}
}

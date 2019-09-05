package cmd

import (
	"flag"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/userconfig"
)

// RunSync runs a 'sync' command line application that syncs a service to a directory
func RunSync() {
	serviceOptions := strings.Join(serviceOptions(), ", ")
	var configPath string
	var adminPath string
	var serviceName string
	var maxPages int
	flag.StringVar(&configPath, "config", constants.DefaultUserConfigPath, "path to config file")
	flag.StringVar(&configPath, "c", constants.DefaultUserConfigPath, "path to config file [shorthand]")
	flag.StringVar(&adminPath, "admin", constants.DefaultUserConfigPath, "path to admin site files")
	flag.StringVar(&adminPath, "a", constants.DefaultUserConfigPath, "path to admin site files [shorthand]")
	flag.StringVar(&serviceName, "service", constants.DefaultServiceName, "which service to sync ("+serviceOptions+")")
	flag.StringVar(&serviceName, "s", constants.DefaultServiceName, "which service to sync ("+serviceOptions+") [shorthand]")
	flag.IntVar(&maxPages, "max-pages", 0, "maximum number of pages to sync in this run (per service)")
	flag.IntVar(&maxPages, "m", 0, "maximum number of pages to sync in this run (per service) [shorthand]")
	flag.Parse()

	serviceConfig := services.NewServiceConfig()
	populateServiceMap(serviceConfig)

	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			userConfig = userconfig.NewUserConfig(sortedServiceNames(), defaultTargets)
		} else {
			log.Println("Error reading config", err)
			return
		}
	}

	if serviceName == "all" {
		runSyncList(adminPath, userConfig, serviceConfig, maxPages)
	} else {
		runSyncService(serviceName, adminPath, userConfig, serviceConfig, maxPages)
	}
}

// runSyncList runs sync on all the services that have credentials
func runSyncList(adminPath string, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig, maxPages int) {
	svcs := map[string]services.SyncService{}
	mux := http.NewServeMux()
	for serviceName, svc := range serviceMap {
		if svc.NeedsCredentials(userConfig) {
			log.Println("Service", serviceName, "needs credentials...skipping.")
			continue
		}
		svcs[serviceName] = svc
		for key, handler := range svc.HTTPHandlers() {
			mux.HandleFunc(key, handler)
		}
	}

	handler, err := attachAdminHTTPHandlers(mux, adminPath, []*userconfig.UserConfig{userConfig}, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach admin HTTP handlers", err)
	}
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)

	i := 1
	for serviceName, svc := range svcs {
		log.Println("Running sync for", serviceName, "(", i, "/", len(svcs), ")")
		if err := svc.Sync(userConfig, maxPages); err != nil {
			log.Println("Error syncing", serviceName, err)
			return
		}
		i++
	}
}

// runSyncService runs sync for an individual service, requesting credentials from the user if needed
func runSyncService(serviceName, adminPath string, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig, maxPages int) {
	svc, exists := serviceMap[serviceName]
	if !exists {
		log.Println("Could not find service: " + serviceName)
		return
	}

	mux := http.NewServeMux()
	for key, handler := range svc.HTTPHandlers() {
		mux.HandleFunc(key, handler)
	}

	handler, err := attachAdminHTTPHandlers(mux, adminPath, []*userconfig.UserConfig{userConfig}, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach admin HTTP handlers", err)
	}
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)

	if err := svc.Sync(userConfig, maxPages); err != nil {
		log.Println("Error syncing", serviceName, err)
	}
}

// runScheduledServiceSync loops over every service that has credentials, and
// if any one is ready for a new sync, starts a goroutine to sync it
func runScheduledServiceSync(userConfig *userconfig.UserConfig) error {
	// Loop over very service in the service map
	for serviceName, service := range serviceMap {
		if service.NeedsCredentials(userConfig) {
			continue
		}

		// Get the last sync
		lastSync, err := services.GetLatestServiceSyncData(userConfig, serviceName)
		if err != nil {
			log.Println("Error getting latest service sync data", err)
			return err
		}

		// If we haven't synced before, we know we can sync right away
		if lastSync == nil {
			go service.Sync(userConfig, constants.MaxAllowablePages)
			continue
		}

		// If the last sync didn't ever end,
		if !lastSync.Ended.Valid {
			// If we're not currently running a sync for it, start one
			if service.CurrentSyncData(userConfig) == nil {
				go service.Sync(userConfig, 1)
			}
			// Either way, either we were running a sync or we're running one now,
			// so let's continue on
			continue
		}

		// Now we need to see what our configured sync time is
		hours := userConfig.GetHoursPerSync(serviceName)
		nextSyncTime := lastSync.Ended.Time.Add(time.Hour * time.Duration(hours))

		// If it's after now, start up a sync and continue on
		if time.Now().UTC().After(nextSyncTime) {
			go service.Sync(userConfig, 1)
			continue
		}
	}

	return nil
}

// runServiceSyncLoop runs runScheduledServiceSync in a loop, reporting any errors to the console, and
// waiting a configurable duration between checks
func runServiceSyncLoop(userConfig *userconfig.UserConfig) {
	for {
		if err := runScheduledServiceSync(userConfig); err != nil {
			log.Println("Error running scheduled service sync:", err)
		}
		time.Sleep(constants.DefaultDurationBetweenSyncChecks)
	}
}

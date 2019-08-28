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

// serviceOptions gets a slice of all the keys in the serviceMap, plus the "all" option
func serviceOptions() []string {
	serviceOptionList := []string{"all"}
	for name := range serviceMap {
		serviceOptionList = append(serviceOptionList, name)
	}
	return serviceOptionList
}

// RunSync runs a 'sync' command line application that syncs a service to a directory
func RunSync() {
	serviceOptions := strings.Join(serviceOptions(), ", ")
	var serviceName string
	serviceConfig := &services.ServiceConfig{}

	flag.StringVar(&serviceName, "service", defaultServiceName, "which service to sync ("+serviceOptions+")")
	flag.StringVar(&serviceName, "s", defaultServiceName, "which service to sync ("+serviceOptions+") [shorthand]")
	flag.StringVar(&serviceConfig.Directory, "directory", services.DefaultDirectory, "which directory to sync to")
	flag.StringVar(&serviceConfig.Directory, "d", services.DefaultDirectory, "which directory to sync to [shorthand]")
	flag.StringVar(&serviceConfig.Format, "format", services.DefaultFormat, "format for how to name and place media")
	flag.StringVar(&serviceConfig.Format, "f", services.DefaultFormat, "format for how to name and place media [shorthand]")
	flag.Int64Var(&serviceConfig.NumFetchers, "num-fetchers", services.DefaultNumFetchers, "number of fetchers to run to download content")
	flag.Int64Var(&serviceConfig.NumFetchers, "n", services.DefaultNumFetchers, "number of fetchers to run to download content [shorthand]")
	flag.IntVar(&serviceConfig.MaxPages, "max-pages", services.DefaultMaxPages, "max pages to fetch, zero meaning auto")
	flag.IntVar(&serviceConfig.MaxPages, "m", services.DefaultMaxPages, "max pages to fetch, zero meaning auto [shorthand]")
	flag.StringVar(&serviceConfig.AdminPath, "admin", services.DefaultAdminPath, "path to admin static site")
	flag.StringVar(&serviceConfig.AdminPath, "a", services.DefaultAdminPath, "path to admin static site [shorthand]")
	flag.Parse()

	store, err := storage.NewStorage(serviceConfig.Directory)
	if err != nil || store == nil {
		log.Println("FATAL: Could not initialize storage driver", err)
		return
	}
	serviceConfig.Storage = store

	serviceConfig.LoadFromEnv()

	populateServiceMap(serviceConfig)

	if serviceName == "all" {
		runSyncList(serviceConfig)
	} else {
		runSyncService(serviceName, serviceConfig)
	}
}

// runSyncList runs sync on all the services that have credentials
func runSyncList(serviceConfig *services.ServiceConfig) {
	svcs := map[string]services.SyncService{}
	mux := http.NewServeMux()
	attachAdminHTTPHandlers(mux, serviceConfig)
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
	handler := attachAdminHTTPHandlers(mux, serviceConfig)
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
func runSyncService(serviceName string, serviceConfig *services.ServiceConfig) {
	svc, exists := serviceMap[serviceName]
	if !exists {
		log.Println("Could not find service: " + serviceName)
		return
	}

	mux := http.NewServeMux()
	attachAdminHTTPHandlers(mux, serviceConfig)
	for key, handler := range svc.HTTPHandlers() {
		mux.HandleFunc(key, handler)
	}

	handler := attachAdminHTTPHandlers(mux, serviceConfig)
	go http.ListenAndServe(":"+serviceConfig.WebPort, handler)
	if err := svc.Sync(); err != nil {
		log.Println("Error syncing", serviceName, err)
	}
}

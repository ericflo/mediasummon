package cmd

import (
	"flag"
	"log"
	"net/http"
	"strings"

	"maxint.co/mediasummon/config"
	"maxint.co/mediasummon/services"
)

const defaultServiceName = "all"
const defaultDirectory = "media"
const defaultFormat = "2006/January/02-15_04_05"
const defaultNumFetchers = 6
const defaultMaxPages = 0

var serviceMap map[string]services.ServiceCreator = map[string]services.ServiceCreator{
	"google": services.NewGoogleService,
}

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
	flag.StringVar(&serviceConfig.Directory, "directory", defaultDirectory, "which directory to sync to")
	flag.StringVar(&serviceConfig.Directory, "d", defaultDirectory, "which directory to sync to [shorthand]")
	flag.StringVar(&serviceConfig.Format, "format", defaultFormat, "format for how to name and place media")
	flag.StringVar(&serviceConfig.Format, "f", defaultFormat, "format for how to name and place media [shorthand]")
	flag.Int64Var(&serviceConfig.NumFetchers, "num-fetchers", defaultNumFetchers, "number of fetchers to run to download content")
	flag.Int64Var(&serviceConfig.NumFetchers, "n", defaultNumFetchers, "number of fetchers to run to download content [shorthand]")
	flag.IntVar(&serviceConfig.MaxPages, "max-pages", defaultMaxPages, "max pages to fetch, zero meaning auto")
	flag.IntVar(&serviceConfig.MaxPages, "m", defaultMaxPages, "max pages to fetch, zero meaning auto [shorthand]")
	flag.Parse()

	if serviceName == "all" {
		runSyncList(serviceConfig)
	} else {
		runSyncService(serviceName, serviceConfig)
	}
}

func runSyncList(serviceConfig *services.ServiceConfig) {
	svcs := map[string]services.SyncService{}
	for serviceName, svcCreator := range serviceMap {
		var svc services.SyncService
		if s, err := svcCreator(serviceConfig); err != nil {
			log.Println("Error setting up", serviceName, err, "...skipping.")
			continue
		} else {
			svc = s
		}
		if svc.NeedsCredentials() {
			log.Println("Service", serviceName, "needs credentials...skipping.")
			continue
		}
		svcs[serviceName] = svc
	}
	i := 1
	for serviceName, svc := range svcs {
		log.Println("Running sync for", serviceName, "(", i, "/", len(svcs), ")")
		svc.Sync()
		i++
	}
}

func runSyncService(serviceName string, serviceConfig *services.ServiceConfig) {
	var svc services.SyncService
	var err error
	if svcCreator, exists := serviceMap[serviceName]; exists {
		if svc, err = svcCreator(serviceConfig); err != nil {
			log.Println("Error creating service", serviceName, err)
			return
		}
	} else {
		log.Println("Could not find service: " + serviceName)
	}
	go http.ListenAndServe(":"+config.WebPort, svc)
	if err = svc.Sync(); err != nil {
		log.Println("Error syncing", serviceName, err)
		return
	}
}

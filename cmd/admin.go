package cmd

import (
	"flag"
	"log"
	"net/http"
	"path/filepath"

	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
)

// RunAdmin runs an 'admin' command line application that serves the mediasummon admin site
func RunAdmin() {
	serviceConfig := &services.ServiceConfig{}

	flag.StringVar(&serviceConfig.Directory, "directory", services.DefaultDirectory, "which directory to sync to")
	flag.StringVar(&serviceConfig.Directory, "d", services.DefaultDirectory, "which directory to sync to [shorthand]")
	serviceConfig.Format = services.DefaultFormat
	// flag.StringVar(&serviceConfig.Format, "format", services.DefaultFormat, "format for how to name and place media")
	// flag.StringVar(&serviceConfig.Format, "f", services.DefaultFormat, "format for how to name and place media [shorthand]")
	serviceConfig.NumFetchers = services.DefaultNumFetchers
	// flag.Int64Var(&serviceConfig.NumFetchers, "num-fetchers", services.DefaultNumFetchers, "number of fetchers to run to download content")
	// flag.Int64Var(&serviceConfig.NumFetchers, "n", services.DefaultNumFetchers, "number of fetchers to run to download content [shorthand]")
	serviceConfig.MaxPages = services.DefaultMaxPages
	// flag.IntVar(&serviceConfig.MaxPages, "max-pages", services.DefaultMaxPages, "max pages to fetch, zero meaning auto")
	// flag.IntVar(&serviceConfig.MaxPages, "m", services.DefaultMaxPages, "max pages to fetch, zero meaning auto [shorthand]")
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

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir(filepath.Join(serviceConfig.AdminPath, "out"))))
	http.ListenAndServe(":"+serviceConfig.WebPort, mux)
}

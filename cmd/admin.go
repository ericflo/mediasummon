package cmd

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/rs/cors"
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
	for _, svc := range serviceMap {
		for key, handler := range svc.HTTPHandlers() {
			mux.HandleFunc(key, handler)
		}
	}

	handler := attachAdminHTTPHandlers(mux, serviceConfig)
	http.ListenAndServe(":"+serviceConfig.WebPort, handler)
}

func attachAdminHTTPHandlers(mux *http.ServeMux, serviceConfig *services.ServiceConfig) http.Handler {
	mux.Handle("/", http.FileServer(http.Dir(filepath.Join(serviceConfig.AdminPath, "out"))))
	mux.HandleFunc("/resources/services.json", handleAdminServiceMapRequest)
	return cors.Default().Handler(mux)
}

func renderJSONErrorMessage(w http.ResponseWriter, message string, code int) {
	// Doing it this way because we can verify using Go's type system that it won't
	// encode improperly as long as it contains no quotes (which we ensure) and then
	// we don't have to branch and check for errors here when there cannot be any
	quoteless := strings.ReplaceAll(message, "\"", "")
	encoded := []byte(fmt.Sprintf("{\"error\":\"%s\"}", quoteless))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(encoded)
}

func renderJSONError(w http.ResponseWriter, err error, code int) {
	renderJSONErrorMessage(w, err.Error(), code)
}

// handleAdminServiceMapRequest handles http requests for the service map
func handleAdminServiceMapRequest(w http.ResponseWriter, r *http.Request) {
	serviceNames := make([]string, 0, len(serviceMap))
	for serviceName := range serviceMap {
		serviceNames = append(serviceNames, serviceName)
	}
	data, err := json.Marshal(serviceNames)
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

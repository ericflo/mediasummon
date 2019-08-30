package cmd

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gorilla/csrf"
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

	handler, err := attachAdminHTTPHandlers(mux, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach Admin HTTP Handlers", err)
		return
	}

	http.ListenAndServe(":"+serviceConfig.WebPort, handler)
}

func attachAdminHTTPHandlers(mux *http.ServeMux, serviceConfig *services.ServiceConfig) (http.Handler, error) {
	mux.Handle("/", CSRFHandler(http.FileServer(http.Dir(filepath.Join(serviceConfig.AdminPath, "out")))))
	mux.HandleFunc("/resources/services.json", makeAdminServiceMapRequest(serviceConfig.Storage))
	mux.HandleFunc("/resources/service/sync.json", handleAdminServiceSync)
	corsMiddleware := cors.New(cors.Options{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowCredentials: true,
		AllowedMethods: []string{
			http.MethodHead,
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
		},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{"X-CSRF-Token"},
		Debug:          false,
	})
	handler := corsMiddleware.Handler(mux)
	if !serviceConfig.IsDebug {
		csrfSecret, err := ensureCSRFSecret(serviceConfig.Storage)
		if err != nil {
			return nil, err
		}
		csrfMiddleware := csrf.Protect([]byte(csrfSecret),
			csrf.ErrorHandler(http.HandlerFunc(renderCORSFailure)),
		)
		handler = csrfMiddleware(handler)
	}
	return handler, nil
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

func renderCORSFailure(w http.ResponseWriter, r *http.Request) {
	renderJSONError(w, csrf.FailureReason(r), http.StatusForbidden)
}

// AdminServiceDescription is the response that the admin gives when talking about a service
type AdminServiceDescription struct {
	Metadata              *services.ServiceMetadata `json:"metadata"`
	NeedsCredentials      bool                      `json:"needs_credentials"`
	CredentialRedirectURL string                    `json:"credential_redirect_url"`
	CurrentSync           *services.ServiceSyncData `json:"current_sync"`
	LastSync              *services.ServiceSyncData `json:"last_sync"`
}

// handleAdminServiceMapRequest handles http requests for the service map
func makeAdminServiceMapRequest(store storage.Storage) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		svcs := make([]*AdminServiceDescription, 0, len(serviceMap))
		for _, serviceName := range sortedServiceNames() {
			svc := serviceMap[serviceName]
			lastSync, err := services.GetLatestServiceSyncData(store, serviceName)
			if err != nil {
				log.Println("Error getting latest service sync data", err)
			}
			svcs = append(svcs, &AdminServiceDescription{
				Metadata:              svc.Metadata(),
				NeedsCredentials:      svc.NeedsCredentials(),
				CredentialRedirectURL: svc.CredentialRedirectURL(),
				CurrentSync:           svc.CurrentSyncData(),
				LastSync:              lastSync,
			})
		}
		data, err := json.Marshal(svcs)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
}

func handleAdminServiceSync(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	serviceID := r.URL.Query().Get("service")
	svc, exists := serviceMap[serviceID]
	if !exists {
		renderJSONErrorMessage(w, "Service with id '"+serviceID+"' was not found.", http.StatusNotFound)
		return
	}
	go svc.Sync()
	data, err := json.Marshal(map[string]string{"status": "ok"})
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

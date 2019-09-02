package cmd

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gorilla/csrf"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/userconfig"
)

type handlerFunc func(http.ResponseWriter, *http.Request, *userconfig.UserConfig, *services.ServiceConfig)

// RunAdmin runs an 'admin' command line application that serves the mediasummon admin site
func RunAdmin() {
	if err := godotenv.Load(".env"); err != nil && !os.IsNotExist(err) {
		log.Printf("Could not load .env file in current directory %v", err)
	}

	var configPath string
	flag.StringVar(&configPath, "config", userconfig.DefaultUserConfigPath, "path to config file")
	flag.StringVar(&configPath, "c", userconfig.DefaultUserConfigPath, "path to config file [shorthand]")
	flag.Parse()

	userConfig, err := userconfig.LoadUserConfig(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			userConfig = userconfig.NewUserConfig(sortedServiceNames())
		} else {
			log.Println("Error reading config", err)
			return
		}
	}

	serviceConfig := services.NewServiceConfig()
	populateServiceMap(serviceConfig)

	mux := http.NewServeMux()
	for _, svc := range serviceMap {
		for key, handler := range svc.HTTPHandlers() {
			mux.HandleFunc(key, handler)
		}
	}

	handler, err := attachAdminHTTPHandlers(mux, userConfig, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach Admin HTTP Handlers", err)
		return
	}

	go runServiceSyncLoop(userConfig)

	http.ListenAndServe(":"+userConfig.WebPort, handler)
}

func attachAdminHTTPHandlers(mux *http.ServeMux, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) (http.Handler, error) {
	mux.Handle("/", CSRFHandler(http.FileServer(http.Dir(filepath.Join(userConfig.AdminPath, "out")))))
	mux.HandleFunc("/resources/services.json", wrapHandler(handleAdminServices, serviceConfig))
	mux.HandleFunc("/resources/service/sync.json", wrapHandler(handleAdminServiceSync, serviceConfig))
	mux.HandleFunc("/resources/targets.json", wrapHandler(handleAdminTargets, serviceConfig))
	mux.HandleFunc("/resources/target/remove.json", wrapHandler(handleAdminTargetRemove, serviceConfig))
	mux.HandleFunc("/resources/target/add.json", wrapHandler(handleAdminTargetAdd, serviceConfig))
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
		csrfSecret, err := ensureCSRFSecret(userConfig)
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

func wrapHandler(handler handlerFunc, serviceConfig *services.ServiceConfig) http.HandlerFunc {
	var user *userconfig.UserConfig
	return func(w http.ResponseWriter, r *http.Request) {
		handler(w, r, user, serviceConfig)
	}
}

func renderJSONErrorMessage(w http.ResponseWriter, message string, code int) {
	encoded, err := json.Marshal(map[string]string{"error": message})
	if err != nil {
		log.Println("Could not encode JSON error message, sending back plaintext error message instead", err)
		w.Header().Set("Content-Type", "text/plain")
		w.WriteHeader(code)
		w.Write([]byte(message))
		return
	}
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

func renderStatusOK(w http.ResponseWriter, r *http.Request) {
	data, err := json.Marshal(map[string]string{"status": "ok"})
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// AdminServiceDescription is the response that the admin gives when talking about a service
type AdminServiceDescription struct {
	Metadata              *services.ServiceMetadata `json:"metadata"`
	NeedsCredentials      bool                      `json:"needs_credentials"`
	CredentialRedirectURL string                    `json:"credential_redirect_url"`
	HoursPerSync          float32                   `json:"hours_per_sync"`
	CurrentSync           *services.ServiceSyncData `json:"current_sync"`
	LastSync              *services.ServiceSyncData `json:"last_sync"`
}

// handleAdminServices handles http requests for the service map
func handleAdminServices(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	svcs := make([]*AdminServiceDescription, 0, len(serviceMap))
	for _, serviceName := range sortedServiceNames() {
		svc := serviceMap[serviceName]
		lastSync, err := services.GetLatestServiceSyncData(userConfig, serviceName)
		if err != nil {
			log.Println("Error getting latest service sync data", err)
		}
		redir, err := svc.CredentialRedirectURL(userConfig)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		svcs = append(svcs, &AdminServiceDescription{
			Metadata:              svc.Metadata(),
			NeedsCredentials:      svc.NeedsCredentials(userConfig),
			CredentialRedirectURL: redir,
			CurrentSync:           svc.CurrentSyncData(userConfig),
			LastSync:              lastSync,
			HoursPerSync:          userConfig.GetHoursPerSync(serviceName),
		})
	}
	data, err := json.MarshalIndent(svcs, "", "  ")
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

// AdminTargetDescription is the response that the admin gives when talking about a sync target
type AdminTargetDescription struct {
	URL string `json:"url"`
}

// makeAdminTargets handles http requests for the service map
func handleAdminTargets(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	adminTargets := make([]*AdminTargetDescription, 0, len(serviceMap))
	store, err := userConfig.GetMultiStore()
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	for _, store := range store.Stores {
		adminTargets = append(adminTargets, &AdminTargetDescription{
			URL: store.URL(),
		})
	}
	data, err := json.MarshalIndent(adminTargets, "", "  ")
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func handleAdminServiceSync(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
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
	go svc.Sync(userConfig, userConfig.MaxPages)
	renderStatusOK(w, r)
}

func handleAdminTargetRemove(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	store, err := userConfig.GetMultiStore()
	if err != nil {
		renderJSONError(w, err, http.StatusBadRequest)
		return
	}
	urlString := r.URL.Query().Get("url")
	_, err = url.Parse(urlString)
	if err != nil {
		renderJSONErrorMessage(w, "Could not parse URL: "+err.Error(), http.StatusBadRequest)
		return
	}
	if err = removeTarget(userConfig, urlString); err != nil {
		renderJSONErrorMessage(w, "Could not remove sync target: "+err.Error(), http.StatusBadRequest)
		return
	}

	if err = store.RemoveTarget(urlString); err != nil {
		renderJSONErrorMessage(w, "Could not remove sync target from in-progress multi store: "+err.Error(), http.StatusInternalServerError)
		return
	}
	renderStatusOK(w, r)
}

func handleAdminTargetAdd(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	store, err := userConfig.GetMultiStore()
	if err != nil {
		renderJSONError(w, err, http.StatusBadRequest)
		return
	}
	urlString := r.URL.Query().Get("url")
	_, err = url.Parse(urlString)
	if err != nil {
		renderJSONErrorMessage(w, "Could not parse URL: "+err.Error(), http.StatusBadRequest)
		return
	}
	if err = addTarget(userConfig, urlString); err != nil {
		renderJSONErrorMessage(w, "Could not add sync target: "+err.Error(), http.StatusBadRequest)
		return
	}
	if err = store.AddTarget(urlString); err != nil {
		renderJSONErrorMessage(w, "Could not add sync target from in-progress multi store: "+err.Error(), http.StatusInternalServerError)
		return
	}
	renderStatusOK(w, r)
}

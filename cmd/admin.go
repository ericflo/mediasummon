package cmd

import (
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gorilla/csrf"
	"github.com/rs/cors"
	"maxint.co/mediasummon/constants"
	"maxint.co/mediasummon/services"
	"maxint.co/mediasummon/storage"
	"maxint.co/mediasummon/userconfig"
)

type handlerFunc func(http.ResponseWriter, *http.Request, *userconfig.UserConfig, *services.ServiceConfig)

// AdminServiceDescription is the response that the admin gives when talking about a service
type AdminServiceDescription struct {
	Metadata              *services.ServiceMetadata `json:"metadata"`
	NeedsApp              bool                      `json:"needs_app"`
	NeedsCredentials      bool                      `json:"needs_credentials"`
	CredentialRedirectURL string                    `json:"credential_redirect_url"`
	AppCreateURL          string                    `json:"app_create_url"`
	HoursPerSync          float32                   `json:"hours_per_sync"`
	CurrentSync           *services.ServiceSyncData `json:"current_sync"`
	LastSync              *services.ServiceSyncData `json:"last_sync"`
}

// AdminTargetDescription is the response that the admin gives when talking about a sync target
type AdminTargetDescription struct {
	URL string `json:"url"`
}

// RunAdmin runs an 'admin' command line application that serves the mediasummon admin site
func RunAdmin() {
	var configPath configPathsFlags
	var adminPath string
	flag.Var(&configPath, "config", "path to config file")
	flag.Var(&configPath, "c", "path to config file [shorthand]")
	flag.StringVar(&adminPath, "admin", constants.DefaultAdminPath, "path to admin site files")
	flag.StringVar(&adminPath, "a", constants.DefaultAdminPath, "path to admin site files [shorthand]")
	flag.Parse()

	serviceConfig := services.NewServiceConfig()
	populateServiceMap(serviceConfig)

	userConfigs, err := userconfig.LoadUserConfigs(configPath.Strings(), sortedServiceNames(), defaultTargets)
	if err != nil {
		log.Println("Error reading config", err)
		return
	}

	mux := http.NewServeMux()
	for _, svc := range serviceMap {
		for key, handler := range svc.HTTPHandlers() {
			mux.HandleFunc(key, handler)
		}
	}

	handler, err := attachAdminHTTPHandlers(mux, adminPath, userConfigs, serviceConfig)
	if err != nil {
		log.Println("Error: Could not attach Admin HTTP Handlers", err)
		return
	}

	for _, userConfig := range userConfigs {
		go runServiceSyncLoop(userConfig)
	}

	http.ListenAndServe(":"+serviceConfig.WebPort, handler)
}

func attachAdminHTTPHandlers(mux *http.ServeMux, adminPath string, userConfigs []*userconfig.UserConfig, serviceConfig *services.ServiceConfig) (http.Handler, error) {
	static := CSRFHandler(http.FileServer(http.Dir(filepath.Join(adminPath, "out"))))
	mux.Handle("/", static)
	mux.Handle("/login", http.StripPrefix("/login", static))
	mux.HandleFunc("/auth/login.json", makeLoginHandler(userConfigs))
	mux.HandleFunc("/resources/config.json", wrapHandler(authRequired(handleAdminUserConfig), serviceConfig))
	mux.HandleFunc("/resources/config/secrets.json", wrapHandler(authRequired(handleAdminUpdateSecrets), serviceConfig))
	mux.HandleFunc("/resources/services.json", wrapHandler(authRequired(handleAdminServices), serviceConfig))
	mux.HandleFunc("/resources/service/sync.json", wrapHandler(authRequired(handleAdminServiceSync), serviceConfig))
	mux.HandleFunc("/resources/targets.json", wrapHandler(authRequired(handleAdminTargets), serviceConfig))
	mux.HandleFunc("/resources/target/remove.json", wrapHandler(authRequired(handleAdminTargetRemove), serviceConfig))
	mux.HandleFunc("/resources/target/add.json", wrapHandler(authRequired(handleAdminTargetAdd), serviceConfig))
	for path, handler := range storage.HTTPHandlers() {
		mux.Handle(path, handler)
	}
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
		csrfMiddleware := csrf.Protect(serviceConfig.CSRFSecret,
			csrf.ErrorHandler(http.HandlerFunc(renderCORSFailure)),
		)
		handler = csrfMiddleware(handler)
	}
	return handler, nil
}

func wrapHandler(handler handlerFunc, serviceConfig *services.ServiceConfig) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var token string
		if tokens, ok := r.Header["Authorization"]; ok && len(tokens) >= 1 {
			token = strings.TrimPrefix(tokens[0], "Bearer ")
		}
		var userConfig *userconfig.UserConfig
		if token != "" {
			// TODO: This should be put in a hmac or something and verified rather than trusted
			userConfigPath, _ := base64.StdEncoding.DecodeString(token)
			if conf, err := userconfig.LoadUserConfig(string(userConfigPath)); err != nil {
				log.Println("Error loading user config", string(userConfigPath), err)
			} else {
				userConfig = conf
			}
		}
		handler(w, r, userConfig, serviceConfig)
	}
}

func authRequired(handler handlerFunc) handlerFunc {
	return func(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
		if userConfig == nil {
			renderAuthFailure(w, r)
			return
		}
		handler(w, r, userConfig, serviceConfig)
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

func renderJSON(w http.ResponseWriter, data interface{}) {
	encoded, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(encoded)
}

func renderStatusOK(w http.ResponseWriter) {
	renderJSON(w, map[string]string{"status": "ok"})
}

func renderJSONError(w http.ResponseWriter, err error, code int) {
	renderJSONErrorMessage(w, err.Error(), code)
}

func renderCORSFailure(w http.ResponseWriter, r *http.Request) {
	renderJSONError(w, csrf.FailureReason(r), http.StatusForbidden)
}

func renderAuthFailure(w http.ResponseWriter, r *http.Request) {
	renderJSONErrorMessage(w, "Must be authenticated to access this resource", http.StatusForbidden)
}

// makeLoginHandler makes a login handler which handles http requests for auth
func makeLoginHandler(userConfigs []*userconfig.UserConfig) http.HandlerFunc {
	paths := make(map[string]string, len(userConfigs))
	for _, config := range userConfigs {
		paths[config.Username] = config.Path
	}
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
			return
		}
		username := r.FormValue("username")
		password := r.FormValue("password")
		path, exists := paths[username]
		if !exists {
			renderJSONErrorMessage(w, "Invalid username or password", http.StatusBadRequest)
			return
		}
		userConfig, err := userconfig.LoadUserConfig(path)
		if err != nil {
			renderJSONError(w, err, http.StatusBadRequest)
			return
		}
		err = userConfig.CheckPassword(password)
		if err != nil {
			renderJSONError(w, err, http.StatusBadRequest)
			return
		}
		renderJSON(w, map[string]string{
			"token": base64.StdEncoding.EncodeToString([]byte(userConfig.Path)),
		})
	}
}

// handleAdminUserConfig handles http requests for the requesting user's config
func handleAdminUserConfig(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	renderJSON(w, userConfig)
}

func handleAdminUpdateSecrets(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	serviceID := r.FormValue("service")
	_, exists := serviceMap[serviceID]
	if !exists {
		renderJSONErrorMessage(w, "Service with id '"+serviceID+"' was not found.", http.StatusNotFound)
		return
	}

	secrets, exists := userConfig.Secrets[serviceID]
	if !exists {
		secrets = map[string]string{}
	}
	secrets["client_id"] = r.FormValue("client_id")
	secrets["client_secret"] = r.FormValue("client_secret")
	userConfig.Secrets[serviceID] = secrets

	if err := userConfig.Save(); err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}

	renderJSON(w, userConfig)
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
		needsApp := false
		if err != nil {
			if err == userconfig.ErrNeedSecrets {
				needsApp = true
				redir = ""
			} else {
				renderJSONError(w, err, http.StatusInternalServerError)
				return
			}
		}
		svcs = append(svcs, &AdminServiceDescription{
			Metadata:              svc.Metadata(),
			NeedsApp:              needsApp,
			NeedsCredentials:      svc.NeedsCredentials(userConfig),
			CredentialRedirectURL: redir,
			AppCreateURL:          svc.AppCreateURL(),
			CurrentSync:           svc.CurrentSyncData(userConfig),
			LastSync:              lastSync,
			HoursPerSync:          userConfig.GetHoursPerSync(serviceName),
		})
	}
	renderJSON(w, svcs)
}

// makeAdminTargets handles http requests for the service map
func handleAdminTargets(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	adminTargets := make([]*AdminTargetDescription, 0, len(serviceMap))
	store, err := storage.CachedStorage(userConfig)
	if err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}
	for _, store := range store.Stores {
		adminTargets = append(adminTargets, &AdminTargetDescription{
			URL: store.URL(),
		})
	}
	renderJSON(w, adminTargets)

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
	maxPagesStr := r.URL.Query().Get("max_pages")
	var maxPages uint64
	if maxPagesStr != "" {
		var err error
		if maxPages, err = strconv.ParseUint(maxPagesStr, 10, 64); err != nil {
			msg := fmt.Sprintf("Invalid max_pages parameter (%v): %v", maxPagesStr, err)
			renderJSONErrorMessage(w, msg, http.StatusBadRequest)
			return
		}
		if maxPages > constants.MaxAllowablePages {
			maxPages = constants.MaxAllowablePages
		}
	}
	go svc.Sync(userConfig, int(maxPages))
	renderStatusOK(w)
}

func handleAdminTargetRemove(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	store, err := storage.CachedStorage(userConfig)
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
	renderStatusOK(w)
}

func handleAdminTargetAdd(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	if r.Method != "POST" {
		renderJSONErrorMessage(w, "Must call POST on this method", http.StatusMethodNotAllowed)
		return
	}
	store, err := storage.CachedStorage(userConfig)
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
	if err = store.AddTarget(userConfig, urlString); err != nil {
		renderJSONErrorMessage(w, "Could not add sync target from in-progress multi store: "+err.Error(), http.StatusInternalServerError)
		return
	}
	renderStatusOK(w)
}

package cmd

import (
	"archive/zip"
	"encoding/base64"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
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

// AdminAuthAppDescription is the struct that holds stuff related to oauth app auth
type AdminAuthAppDescription struct {
	NeedsApp              bool   `json:"needs_app"`
	NeedsCredentials      bool   `json:"needs_credentials"`
	CredentialRedirectURL string `json:"credential_redirect_url"`
	AppCreateURL          string `json:"app_create_url"`
}

// AdminServiceDescription is the response that the admin gives when talking about a service
type AdminServiceDescription struct {
	AdminAuthAppDescription
	Metadata     *services.ServiceMetadata `json:"metadata"`
	HoursPerSync float32                   `json:"hours_per_sync"`
	CurrentSync  *services.ServiceSyncData `json:"current_sync"`
	LastSync     *services.ServiceSyncData `json:"last_sync"`
}

// AdminTargetDescription is the response that the admin gives when talking about a sync target
type AdminTargetDescription struct {
	AdminAuthAppDescription
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

	if err := ensureAdminSite(adminPath); err != nil {
		log.Println("Error: Admin site files did not exist but we could not download them:", err)
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

func ensureAdminSite(adminPath string) error {
	if _, err := os.Stat(adminPath); err != nil {
		if os.IsNotExist(err) {
			return downloadAdminSite(adminPath)
		}
		return err
	}
	return nil
}

func downloadAdminSite(adminPath string) error {
	url := "https://github.com/ericflo/mediasummon/archive/master.zip"

	log.Println("Could not find admin site static files, downloading them now...")

	// Make a tempfile to download the zip into
	tmpFile, err := ioutil.TempFile(os.TempDir(), ".tmpdownload-")
	if err != nil {
		return err
	}
	if tmpFile == nil {
		return errors.New("Could not create temporary file for admin site to download to")
	}
	defer os.Remove(tmpFile.Name())

	// Create the request
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("Got status code other than 200: %v", resp.Status)
	}

	// Stream the request body to the tempfile and then close it
	if _, err = io.Copy(tmpFile, resp.Body); err != nil {
		return err
	}
	tmpFile.Close()

	log.Println("Finished downloading admin static files, now extracting...")

	// Re-open the file but this time with a zip reader
	zipFile, err := zip.OpenReader(tmpFile.Name())
	if err != nil {
		return err
	}

	log.Println("Ensuring that admin output directory exists...")
	// Make sure the outDir exists
	outDir := filepath.Join(adminPath, "out")
	if err = os.MkdirAll(outDir, 0644); err != nil {
		return err
	}

	for _, file := range zipFile.File {
		if !strings.HasPrefix(file.Name, "mediasummon-master/admin/out") {
			continue
		}
		if strings.HasSuffix(file.Name, "/") { // Skip directories
			continue
		}
		log.Println("Extracting", file.Name)

		zipf, err := file.Open()
		if err != nil {
			return err
		}
		defer zipf.Close()

		outpath := filepath.Join(outDir, strings.TrimPrefix(file.Name, "mediasummon-master/admin/out"))
		if err = os.MkdirAll(filepath.Dir(outpath), 0644); err != nil {
			return err
		}
		outfile, err := os.OpenFile(outpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
		if err != nil {
			return err
		}
		defer outfile.Close()

		if _, err = io.Copy(outfile, zipf); err != nil {
			return err
		}
	}

	log.Println("Finished extracting admin site static files. Continuing on!")

	return nil
}

func attachAdminHTTPHandlers(mux *http.ServeMux, adminPath string, userConfigs []*userconfig.UserConfig, serviceConfig *services.ServiceConfig) (http.Handler, error) {
	static := CSRFHandler(http.FileServer(http.Dir(filepath.Join(adminPath, "out"))))
	mux.Handle("/", static)
	mux.Handle("/login", http.StripPrefix("/login", static))
	mux.HandleFunc("/auth/login.json", makeLoginHandler(userConfigs))
	mux.HandleFunc("/resources/config.json", wrapHandler(authRequired(handleAdminUserConfig), serviceConfig))
	mux.HandleFunc("/resources/config/secrets.json", wrapHandler(authRequired(handleAdminUpdateSecrets), serviceConfig))
	mux.HandleFunc("/resources/config/appauth.json", wrapHandler(authRequired(handleAdminAppAuth), serviceConfig))
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
	secretName := r.FormValue("secret")
	secrets, exists := userConfig.Secrets[secretName]
	if !exists {
		secrets = map[string]string{}
	}
	for key := range r.Form {
		if key == "secret" {
			continue
		}
		secrets[key] = r.FormValue(key)
	}
	userConfig.Secrets[secretName] = secrets

	if err := userConfig.Save(); err != nil {
		renderJSONError(w, err, http.StatusInternalServerError)
		return
	}

	renderJSON(w, userConfig)
}

func handleAdminAppAuth(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	resp := map[string]*AdminAuthAppDescription{}
	for _, serviceName := range sortedServiceNames() {
		desc, err := authDescriptionForService(serviceName, userConfig)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		resp[serviceName] = desc
	}
	stores := map[string]string{
		"s3":      "s3://example",
		"gdrive":  "gdrive://",
		"dropbox": "dropbox:///Mediasummon",
	}
	for storeName, storeURL := range stores {
		store, err := storage.NewStorageSingle(userConfig, storeURL)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		desc, err := authDescriptionForStorage(store)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		resp[storeName] = desc
	}
	renderJSON(w, resp)
}

// handleAdminServices handles http requests for the service map
func handleAdminServices(w http.ResponseWriter, r *http.Request, userConfig *userconfig.UserConfig, serviceConfig *services.ServiceConfig) {
	svcs := make([]*AdminServiceDescription, 0, len(serviceMap))
	for _, serviceName := range sortedServiceNames() {
		desc, err := authDescriptionForService(serviceName, userConfig)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		svc := serviceMap[serviceName]
		lastSync, err := services.GetLatestServiceSyncData(userConfig, serviceName)
		if err != nil {
			log.Println("Error getting latest service sync data", err)
		}
		svcs = append(svcs, &AdminServiceDescription{
			AdminAuthAppDescription: *desc,
			Metadata:                svc.Metadata(),
			CurrentSync:             svc.CurrentSyncData(userConfig),
			LastSync:                lastSync,
			HoursPerSync:            userConfig.GetHoursPerSync(serviceName),
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
		desc, err := authDescriptionForStorage(store)
		if err != nil {
			renderJSONError(w, err, http.StatusInternalServerError)
			return
		}
		adminTargets = append(adminTargets, &AdminTargetDescription{
			AdminAuthAppDescription: *desc,
			URL:                     store.URL(),
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

// Utility functions

func authDescriptionForService(serviceName string, userConfig *userconfig.UserConfig) (*AdminAuthAppDescription, error) {
	svc := serviceMap[serviceName]
	redir, err := svc.CredentialRedirectURL(userConfig)
	needsApp := false
	if err != nil {
		if err == userconfig.ErrNeedSecrets {
			needsApp = true
			redir = ""
		} else {
			return nil, err
		}
	}
	return &AdminAuthAppDescription{
		NeedsApp:              needsApp,
		NeedsCredentials:      svc.NeedsCredentials(userConfig),
		CredentialRedirectURL: redir,
		AppCreateURL:          svc.AppCreateURL(),
	}, nil
}

func authDescriptionForStorage(store storage.Storage) (*AdminAuthAppDescription, error) {
	err := store.NeedsCredentials()
	needsApp := err == userconfig.ErrNeedSecrets
	needsCredentials := err != nil
	var redir string
	if !needsApp {
		redir, err = store.CredentialRedirectURL()
		if err != nil {
			return nil, err
		}
	}
	return &AdminAuthAppDescription{
		NeedsApp:              needsApp,
		NeedsCredentials:      needsCredentials,
		CredentialRedirectURL: redir,
		AppCreateURL:          store.AppCreateURL(),
	}, nil
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

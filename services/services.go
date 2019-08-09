package services

import "net/http"

const maxAllowablePages = 1000000

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup() error
	NeedsCredentials() bool
	CredentialRedirectURL() string
	Sync() error
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

// ServiceConfig is a struct that can configure a service
type ServiceConfig struct {
	Directory   string
	Format      string
	NumFetchers int64
	MaxPages    int
}

// ServiceCreator is a function that can create a sync service
type ServiceCreator func(serviceConfig *ServiceConfig) (SyncService, error)

// applyMaxPagesHeuristic should be called in Setup() by SyncService implementers, to
// apply this heuristic in a common way across all services
func applyMaxPagesHeuristic(svc SyncService, serviceConfig *ServiceConfig) {
	// Apply max pages heuristics
	if serviceConfig.MaxPages < 0 {
		serviceConfig.MaxPages = maxAllowablePages
	} else if serviceConfig.MaxPages == 0 {
		if svc.NeedsCredentials() {
			// First time we sync the whole thing
			serviceConfig.MaxPages = maxAllowablePages
		} else {
			// After that we just sync the latest page
			serviceConfig.MaxPages = 1
		}
	}
}

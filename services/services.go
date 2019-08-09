package services

import "net/http"

// SyncService represents a service that can be synchronized to a directory
type SyncService interface {
	Setup()
	NeedsCredentials() bool
	CredentialRedirectURL() string
	Sync() error
	ServeHTTP(w http.ResponseWriter, r *http.Request)
}

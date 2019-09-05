package storage

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"maxint.co/mediasummon/userconfig"
)

var dropboxEndpoint = oauth2.Endpoint{
	AuthURL:  "https://www.dropbox.com/oauth2/authorize",
	TokenURL: "https://www.dropbox.com/oauth2/token",
}
var gdriveScopes = []string{
	"https://www.googleapis.com/auth/drive.appfolder",
	"https://www.googleapis.com/auth/drive.file",
	"https://www.googleapis.com/auth/drive.install",
}
var dropboxScopes []string

// HTTPHandlers returns a list of HTTP handlers for the storage interfaces
func HTTPHandlers() map[string]http.HandlerFunc {
	return map[string]http.HandlerFunc{
		"/auth/dropbox/return": makeReturnHandler("dropbox", dropboxEndpoint, dropboxScopes),
		"/auth/gdrive/return":  makeReturnHandler("gdrive", google.Endpoint, gdriveScopes),
	}
}

func makeReturnHandler(name string, endpoint oauth2.Endpoint, scopes []string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			displayErrorPage(w, "Could not parse "+name+"'s response")
			return
		}
		code := r.URL.Query().Get("code")
		if len(code) == 0 {
			displayErrorPage(w, "Invalid authentication code from "+name)
			return
		}
		configPath := r.URL.Query().Get("state")
		userConfig, err := userconfig.LoadUserConfig(configPath)
		if err != nil {
			displayErrorPage(w, "Could not load user config: "+err.Error())
			return
		}
		oauthConf, err := oAuth2Conf(userConfig, name, endpoint, scopes)
		if err != nil {
			displayErrorPage(w, "Could not load auth conf: "+err.Error())
			return
		}
		tok, err := oauthConf.Exchange(oauth2.NoContext, code)
		if err != nil {
			displayErrorPage(w, "Could not complete token exchange with "+name+". "+err.Error())
			return
		}
		if err = saveOAuthData(userConfig, name, tok); err != nil {
			displayErrorPage(w, err.Error())
			return
		}
		http.Redirect(w, r, "/", http.StatusFound)
	}
}

func saveOAuthData(userConfig *userconfig.UserConfig, storageName string, tok *oauth2.Token) error {
	secrets, _ := userConfig.Secrets[storageName]
	if secrets == nil {
		secrets = map[string]string{}
	}
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode authentication token to save: %v", err)
	}
	secrets["token"] = string(encodedTok)
	userConfig.Secrets[storageName] = secrets
	return userConfig.Save()
}

func loadOAuthData(userConfig *userconfig.UserConfig, storageName string) (*oauth2.Token, error) {
	secrets, _ := userConfig.Secrets[storageName]
	if secrets == nil {
		return nil, nil
	}
	var tok *oauth2.Token
	var err error
	if encodedToken, exists := secrets["token"]; exists {
		err = json.Unmarshal([]byte(encodedToken), &tok)
	}
	return tok, err
}

func oAuth2Conf(userConfig *userconfig.UserConfig, storageName string, endpoint oauth2.Endpoint, scopes []string) (*oauth2.Config, error) {
	clientID, err := userConfig.GetSecret(storageName, "client_id")
	if err != nil {
		return nil, err
	}
	clientSecret, err := userConfig.GetSecret(storageName, "client_secret")
	if err != nil {
		return nil, err
	}
	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  userConfig.FrontendURL + "/auth/" + storageName + "/return",
		Scopes:       scopes,
		Endpoint:     endpoint,
	}, nil
}

// displayErrorPage writes a basic text error message to the http response
func displayErrorPage(w http.ResponseWriter, msg string) {
	w.Write([]byte("Error: " + msg))
}

package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
	"maxint.co/mediasummon/userconfig"
)

func saveOAuthData(userConfig *userconfig.UserConfig, serviceName string, tok *oauth2.Token) error {
	secrets, _ := userConfig.Secrets[serviceName]
	if secrets == nil {
		secrets = map[string]string{}
	}
	encodedTok, err := json.Marshal(tok)
	if err != nil {
		return fmt.Errorf("Could not encode authentication token to save: %v", err)
	}
	secrets["token"] = string(encodedTok)
	userConfig.Secrets[serviceName] = secrets
	return userConfig.Save()
}

func loadOAuthData(userConfig *userconfig.UserConfig, serviceName string) (*oauth2.Token, error) {
	secrets, _ := userConfig.Secrets[serviceName]
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

func oAuth2Conf(userConfig *userconfig.UserConfig, serviceName string, endpoint oauth2.Endpoint, scopes []string) (*oauth2.Config, error) {
	clientID, err := userConfig.GetSecret(serviceName, "client_id")
	if err != nil {
		return nil, err
	}
	clientSecret, err := userConfig.GetSecret(serviceName, "client_secret")
	if err != nil {
		return nil, err
	}
	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  userConfig.FrontendURL + "/auth/" + serviceName + "/return",
		Scopes:       scopes,
		Endpoint:     endpoint,
	}, nil
}

func oAuth2Client(userConfig *userconfig.UserConfig, serviceName string, endpoint oauth2.Endpoint, scopes []string) (*http.Client, error) {
	oauthConf, err := oAuth2Conf(userConfig, serviceName, endpoint, scopes)
	if err != nil {
		return nil, err
	}
	tok, err := loadOAuthData(userConfig, serviceName)
	if err != nil {
		return nil, err
	}
	if tok == nil {
		return nil, ErrNeedAuthentication
	}
	return oauthConf.Client(oauth2.NoContext, tok), nil
}

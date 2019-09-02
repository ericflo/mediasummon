package cmd

import (
	"crypto/rand"
	"net/http"

	"github.com/gorilla/csrf"
	"maxint.co/mediasummon/userconfig"
)

type csrfWriter struct {
	w           http.ResponseWriter
	token       string
	wroteHeader bool
}

func (cw csrfWriter) WriteHeader(code int) {
	if cw.wroteHeader == false {
		cw.w.Header().Set("X-CSRF-Token", cw.token)
		cw.wroteHeader = true
	}
	cw.w.WriteHeader(code)
}

func (cw csrfWriter) Write(b []byte) (int, error) {
	return cw.w.Write(b)
}

func (cw csrfWriter) Header() http.Header {
	return cw.w.Header()
}

// CSRFHandler attaches an X-CSRF-Token header to the response
func CSRFHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sw := csrfWriter{
			w:           w,
			token:       csrf.Token(r),
			wroteHeader: false,
		}
		h.ServeHTTP(sw, r)
	})
}

func ensureCSRFSecret(userConfig *userconfig.UserConfig) ([]byte, error) {
	meta, _ := userConfig.Secrets["meta"]
	if meta == nil {
		meta = map[string]string{}
	}
	secret, _ := meta["CSRF"]
	var bSecret []byte
	if secret == "" {
		bSecret = make([]byte, 32)
		if _, err := rand.Read(bSecret); err != nil {
			return nil, err
		}
		meta["CSRF"] = string(bSecret)
		userConfig.Secrets["meta"] = meta
		if err := userConfig.Save(); err != nil {
			return nil, err
		}
	} else {
		bSecret = []byte(secret)
	}
	return bSecret, nil
}

package cmd

import (
	"crypto/rand"
	"net/http"
	"path/filepath"

	"github.com/gorilla/csrf"
	"maxint.co/mediasummon/storage"
)

var _csrfSecret []byte

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

func ensureCSRFSecret(store storage.Storage) ([]byte, error) {
	if _csrfSecret != nil {
		return _csrfSecret, nil
	}
	filePath := filepath.Join(".meta", "csrf.txt")
	blob, err := store.ReadBlob(filePath)
	if err != nil {
		return nil, err
	}
	if blob == nil || len(blob) == 0 {
		blob = make([]byte, 32)
		if _, err = rand.Read(blob); err != nil {
			return nil, err
		}
		if err = store.WriteBlob(filePath, blob); err != nil {
			return nil, err
		}
		_csrfSecret = blob
	}
	return blob, nil
}

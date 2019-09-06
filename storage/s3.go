package storage

import (
	"bytes"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"maxint.co/mediasummon/userconfig"
)

type s3Storage struct {
	userConfig *userconfig.UserConfig
	bucketName string
	directory  string
	svc        *s3.S3
	uploader   *s3manager.Uploader
}

// NewS3Storage creates a new storage interface that can talk to S3
func NewS3Storage(userConfig *userconfig.UserConfig, fullPath string) (Storage, error) {
	splitPath := strings.Split(fullPath, "/")
	if len(splitPath) == 0 {
		return nil, fmt.Errorf("Your bucket cannot be empty: %v", fullPath)
	}
	bucketName := splitPath[0]

	cID, _ := userConfig.GetSecretOrEnv("s3", "aws_access_key_id", "AWS_ACCESS_KEY_ID")
	cSecret, _ := userConfig.GetSecretOrEnv("s3", "aws_secret_access_key", "AWS_SECRET_ACCESS_KEY")
	cRegion, _ := userConfig.GetSecretOrEnv("s3", "region", "AWS_DEFAULT_REGION")

	svc := s3.New(session.New(&aws.Config{
		Region:      aws.String(cRegion),
		Credentials: credentials.NewStaticCredentials(cID, cSecret, ""),
	}))
	return &s3Storage{
		userConfig: userConfig,
		bucketName: bucketName,
		directory:  strings.Join(splitPath[1:], "/"),
		svc:        svc,
		uploader:   s3manager.NewUploaderWithClient(svc),
	}, nil
}

// URL returns the string of the url to this storage interface
func (store *s3Storage) URL() string {
	ret := "s3://" + store.bucketName
	if store.directory != "" {
		ret += "/" + store.directory
	}
	return NormalizeStorageURL(ret)
}

// Protocol returns the protocol of the url to this storage interface
func (store *s3Storage) Protocol() string {
	return "s3"
}

// Exists returns true if the path refers to a file that exists on S3
func (store *s3Storage) Exists(path string) (bool, error) {
	key := normalizePath(filepath.Join(store.directory, path))
	_, err := store.svc.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(store.bucketName),
		Key:    aws.String(key),
	})
	if err == nil {
		return true, nil
	}
	if ae, ok := err.(awserr.Error); ok {
		code := ae.Code()
		if strings.Contains(code, "NoSuchKey") || strings.Contains(code, "NotFound") {
			return false, nil
		}
		return false, err
	}
	return false, err
}

// EnsureDirectoryExists makes sure that the given "directory" exists in S3, or it returns an error.
// In this case, that means basically it makes a key named <DIRECTORY>/.directory and puts a file with
// the current time in it. When S3 is listing keys, it will see this one and know the directory exists,
// but we will otherwise ignore the file.
func (store *s3Storage) EnsureDirectoryExists(path string) error {
	fullPath := normalizePath(filepath.Join(store.directory, path))
	if !strings.HasSuffix(fullPath, "/") {
		fullPath += "/"
	}
	fullPath += ".directory"
	exists, err := store.Exists(fullPath)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}
	return store.WriteBlob(fullPath, []byte(time.Now().UTC().String()))
}

// DownloadFromURL downloads the contents of the given URL and saves it to the given path
// on S3, using a temporary file in-between
func (store *s3Storage) DownloadFromURL(url, path string) (string, error) {
	log.Println("Downloading item", path)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	tmpFile, err := ioutil.TempFile(filepath.Dir(os.TempDir()), ".tmpdownload-")
	if err != nil || tmpFile == nil {
		log.Println("Could not create temporary file:", err)
		return "", fmt.Errorf("Could not create temporary file: %v", err)
	}
	defer os.Remove(tmpFile.Name())

	sha512 := sha512.New()
	multiWriter := io.MultiWriter(tmpFile, sha512)

	if _, err = io.Copy(multiWriter, resp.Body); err != nil {
		log.Println("Error downloading file:", err)
		return "", fmt.Errorf("Error downloading file: %v", err)
	}

	if _, err = tmpFile.Seek(0, 0); err != nil {
		log.Println("Could not seek back to beginning of tempfile", err)
		return "", err
	}

	contentType := mime.TypeByExtension(filepath.Ext(url))
	if contentType == "" {
		// TODO: Is guessing image/jpeg correct here?
		contentType = "image/jpeg"
	}
	_, err = store.uploader.Upload(&s3manager.UploadInput{
		Bucket:      aws.String(store.bucketName),
		Key:         aws.String(normalizePath(filepath.Join(store.directory, path))),
		Body:        tmpFile,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", err
	}

	if err = tmpFile.Close(); err != nil {
		log.Println("Could not close temporary file:", err)
	}

	return hex.EncodeToString(sha512.Sum(nil)), nil
}

// ReadBlob reads the S3 blob at the given path into memory and returns it as a slice of bytes
func (store *s3Storage) ReadBlob(path string) ([]byte, error) {
	objOut, err := store.svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(store.bucketName),
		Key:    aws.String(normalizePath(filepath.Join(store.directory, path))),
	})
	if err != nil {
		return nil, err
	}
	return ioutil.ReadAll(objOut.Body)
}

// WriteBlob takes the given slice of bytes and writes it to the given path
func (store *s3Storage) WriteBlob(path string, blob []byte) error {
	_, err := store.uploader.Upload(&s3manager.UploadInput{
		Bucket:      aws.String(store.bucketName),
		Key:         aws.String(normalizePath(filepath.Join(store.directory, path))),
		Body:        bytes.NewBuffer(blob),
		ContentType: aws.String("application/octet-stream"),
	})
	return err
}

// ListDirectoryFiles lists the names of all the files contained in a directory
func (store *s3Storage) ListDirectoryFiles(path string) ([]string, error) {
	prefix := normalizePath(filepath.Join(store.directory, path))
	if !strings.HasSuffix(prefix, "/") {
		prefix += "/"
	}
	objOut, err := store.svc.ListObjects(&s3.ListObjectsInput{
		Bucket:    aws.String(store.bucketName),
		Delimiter: aws.String("/"),
		Prefix:    aws.String(prefix),
	})
	if err != nil {
		return nil, err
	}
	if *objOut.IsTruncated {
		log.Println("Warning: S3 directory listing truncated. This will result in buggy behavior until pagination is implemented.")
	}
	resp := make([]string, 0, len(objOut.Contents))
	for _, item := range objOut.Contents {
		filename := strings.TrimPrefix(*item.Key, path)
		resp = append(resp, filename)
	}
	return resp, nil
}

// NeedsCredentials returns an error if it needs secrets, nil if it does not
func (store *s3Storage) NeedsCredentials() error {
	cID, _ := store.userConfig.GetSecretOrEnv("s3", "aws_access_key_id", "AWS_ACCESS_KEY_ID")
	cSecret, _ := store.userConfig.GetSecretOrEnv("s3", "aws_secret_access_key", "AWS_SECRET_ACCESS_KEY")
	cRegion, _ := store.userConfig.GetSecretOrEnv("s3", "region", "AWS_DEFAULT_REGION")
	if cID == "" || cSecret == "" || cRegion == "" {
		return userconfig.ErrNeedSecrets
	}
	return nil
}

// CredentialRedirectURL always returns an empty string for the S3 interface
func (store *s3Storage) CredentialRedirectURL() (string, error) {
	return "", nil
}

// AppCreateURL returns the URL where the user can create an IAM user to get credentials
func (store *s3Storage) AppCreateURL() string {
	return "https://console.aws.amazon.com/iam/home"
}

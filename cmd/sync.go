package cmd

import (
	"flag"
	"fmt"
	"os"

	"maxint.co/photoboomerang/services"
)

const defaultServiceName = "google"
const defaultDirectory = "photos"
const defaultFormat = "2006/January/02-15_04_05"
const defaultNumFetchers = 12

func RunSync() {
	var serviceName string
	var directory string
	var format string
	var numFetchers int64
	flag.StringVar(&serviceName, "service", defaultServiceName, "which service to sync")
	flag.StringVar(&serviceName, "s", defaultServiceName, "which service to sync (shorthand)")
	flag.StringVar(&directory, "directory", defaultDirectory, "which directory to sync to")
	flag.StringVar(&directory, "d", defaultDirectory, "which directory to sync to (shorthand)")
	flag.StringVar(&format, "format", defaultFormat, "format for how to name and place photos")
	flag.StringVar(&format, "f", defaultFormat, "format for how to name and place photos (shorthand)")
	flag.Int64Var(&numFetchers, "num-fetchers", defaultNumFetchers, "number of fetchers to run to download content")
	flag.Int64Var(&numFetchers, "n", defaultNumFetchers, "number of fetchers to run to download content (shorthand)")
	flag.Parse()

	switch serviceName {
	case "google":
		services.SyncGoogle(directory, format, numFetchers)
	default:
		fmt.Fprintf(os.Stderr, "Unknown service name: %s", serviceName)
	}
}

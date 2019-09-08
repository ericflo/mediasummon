#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/.."

go build -o ./bin/mediasummon maxint.co/mediasummon
./bin/mediasummon "$@"
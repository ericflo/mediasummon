#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR/.."

mkdir -p ~/mediasummon
docker container run -p 5000:5000 --mount type=bind,source=~/mediasummon,target=/mediasummon -it --rm ericflo/mediasummon:latest admin
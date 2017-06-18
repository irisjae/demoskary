#!/usr/bin/env bash
DIR="$(sudo dirname $(readlink -f $0))"
cd "$DIR"

. ~/.nvm/nvm.sh
nvm use 7.1.0
node --version
node build.js

cordova build browser
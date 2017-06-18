#!/usr/bin/env bash
DIR="$(sudo dirname $(readlink -f $0))"
cd "$DIR"

echo
echo
echo checking screen...
if dpkg-query -l screen; then
    echo screen already installed
else
    echo trying install screen...
    sudo apt-get update
    sudo apt-get install screen
fi

echo
echo
echo checking nvm version...
. ~/.nvm/nvm.sh
nvm install 7.1.0
nvm alias default node

echo
echo
echo checking npm version...
if ! npm outdated -g npm | grep -z npm; then
    echo npm is up to date
else
    echo trying to update npm...
    npm install -g npm
fi

echo
echo
echo checking cordova...
if npm list -g cordova; then
    echo cordova already installed
else
    echo trying install cordova...
    npm install -g cordova
    if cordova platform | grep -z "Installed.*browser.*Available"; then
        echo platform browser installed, removing outdated...
        cordova platform rm browser
    fi    
    if cordova platform | grep -z "Installed.*android.*Available"; then
        echo platform android installed, removing outdated...
        cordova platform rm android
    fi    
    if cordova platform | grep -z "Installed.*ios.*Available"; then
        echo platform ios installed, removing outdated...
        cordova platform rm ios
    fi    
    cordova platform add browser android ios
fi

echo
echo
echo installing npm packages...
npm install
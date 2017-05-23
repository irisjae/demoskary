DIR=sudo dirname $(readlink -f $0)
cd "$DIR"

nvm use 7.1.0
node --version
node build/make-app.js

cordova build browser
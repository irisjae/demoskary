DIR=sudo dirname $(readlink -f $0)
cd "$DIR"

nvm install 7.1.0

sudo apt-get update
sudo apt-get install screen

sudo npm install -g cordova

cd ..
npm install
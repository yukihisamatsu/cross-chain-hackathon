#!/bin/bash
set -e

mkdir src
cd src
git clone $REPO_URL
cd $APP_DIR
make build

mv ./build/simappcli /usr/bin/simappcli
mv ./build/simappd /usr/bin/simappd

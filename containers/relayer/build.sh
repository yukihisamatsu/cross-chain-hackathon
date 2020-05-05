#!/bin/sh
set -e

mkdir src
cd src
git clone https://github.com/datachainlab/relayer
cd relayer
git checkout cross
make build

mv ./build/rly /usr/bin/rly

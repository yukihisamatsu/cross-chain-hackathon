#!/bin/sh
set -e

mkdir src
cd src
git clone https://github.com/datachainlab/relayer
cd relayer
git checkout refs/tags/v10.0.2
make build

mv ./build/rly /usr/bin/rly

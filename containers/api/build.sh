#!/bin/sh
set -e

git clone https://github.com/datachainlab/cross-chain-hackathon
cd cross-chain-hackathon/backend
git checkout develop

make build-server

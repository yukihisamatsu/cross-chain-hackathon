#!/bin/bash
set -e

PWD=$(cd $(dirname $0); pwd)
DB=${PWD}/../demo.db
DATA_DIR=${PWD}/../db/initdata

sqlite3 -separator , ${DB} ".import ${DATA_DIR}/user.csv user"
sqlite3 -separator , ${DB} ".import ${DATA_DIR}/estate.csv estate"

exit 0

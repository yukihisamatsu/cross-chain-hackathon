DOCKER?=docker

PWD=${shell pwd}
OPENAPI_SRC=./openapi.yml
SERVER_CONFIG=./server-config.json
SERVER_OUTDIR=./apiserver

GIT_USER_ID=datachainlab
SERVER_REPO_ID=cross-chain-hackathon/backend/apiserver
SERVER_PACKAGE_NAME=api
SERVER_GENERATED_SRC=api

DB_PATH=${PWD}/demo.db

# cf. https://openapi-generator.tech/docs/generators#client-generators
TS_CLIENT_TYPE=typescript-fetch

gen-server-stub:
	${DOCKER} run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
       --git-user-id=${GIT_USER_ID} \
	   --git-repo-id=${SERVER_REPO_ID} \
	   --config=/local/${SERVER_CONFIG} \
 	   -i /local/${OPENAPI_SRC} \
 	   -g go-server \
 	   -o /local/${SERVER_OUTDIR}

gen-client:
	${DOCKER} run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
 	   -i /local/${OPENAPI_SRC} \
 	   -g ${TS_CLIENT_TYPE} \
 	   -o /local/out/${TS_CLIENT_TYPE}

run-mock-server:
	${DOCKER} run --rm -v ${PWD}:/local -p 8000:8000 danielgtaylor/apisprout /local/${OPENAPI_SRC} 

run-doc:
	${DOCKER} run --rm -v ${PWD}:/local -p 8080:8080 -e SWAGGER_JSON=/local/${OPENAPI_SRC} swaggerapi/swagger-ui

# TODO
run-server:
	DB_PATH=${DB_PATH} ${MAKE} -C apiserver run

setup-db: migrate-reset migrate-up
	${PWD}/scripts/initdata.sh

migrate-reset:
	goose -dir ${PWD}/db/migrations sqlite3 ${DB_PATH} reset

migrate-up:
	goose -dir ${PWD}/db/migrations sqlite3 ${DB_PATH} up

migrate-down:
	goose -dir ${PWD}/db/migrations sqlite3 ${DB_PATH} down

DOCKER?=docker

PWD=${shell pwd}
OPENAPI_SRC=./openapi.yml
SERVER_CONFIG=./server-config.json
SERVER_OUTDIR=./apiserver

GIT_USER_ID=datachainlab
SERVER_REPO_ID=cross-chain-hackathon/backend/apiserver
SERVER_PACKAGE_NAME=api
SERVER_GENERATED_SRC=api

# cf. https://openapi-generator.tech/docs/generators#client-generators
TS_CLIENT_TYPE=typescript-axios

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

build-server:
	make -C apiserver build

run-server:
	make -C apiserver run

setup-db: 
	make -C apiserver setup-db

migrate-reset:
	make -C apiserver migrate-reset

migrate-up:
	make -C apiserver migrate-up

migrate-down:
	make -C apiserver migrate-down

e2e-test: setup-db
	bats ./e2e-test


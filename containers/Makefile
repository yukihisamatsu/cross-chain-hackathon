AWS?=aws
AWS_REGION?=us-east-1
AWS_ACCOUNT_ID?=513838501479

TAG=latest

REPO_BASE?=$(AWS_ACCOUNT_ID).dkr.ecr.us-east-1.amazonaws.com

APP_REPO_URL?="https://github.com/datachainlab/cross-chain-hackathon"
APP_DIR="cross-chain-hackathon/contract"

.PHONY: build-image build-image-coin build-image-coordinator build-image-security build-image-relayer build-image-api \
		deploy-image deploy-image-api deploy-image-coin deploy-image-coordinator deploy-image-relayer deploy-image-security

ecr-login:
	$(AWS) --region $(AWS_REGION) ecr get-login-password | docker login --username AWS --password-stdin https://$(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

build-image:
	make build-image-coordinator
	make build-image-security
	make build-image-coin
	make build-image-relayer

deploy-image: ecr-login build-image
	make deploy-image-coordinator
	make deploy-image-security
	make deploy-image-coin
	make deploy-image-relayer
	make deploy-image-api

COORDINATOR_REPO?=cch-coordinator
COORDINATOR_CHAIN_ID?=coordinatorz
COORDINATOR_MNEMONIC?="uncle wink forum finish collect midnight capable park fabric quarter seed abuse curve market choice base execute initial bulb title enrich spread exit update"

build-image-coordinator:
	cd chain && docker build . -t $(REPO_BASE)/$(COORDINATOR_REPO):$(TAG) \
	--build-arg CHAIN_ID=$(COORDINATOR_CHAIN_ID) \
	--build-arg MNEMONIC=$(COORDINATOR_MNEMONIC) \
	--build-arg REPO_URL=$(APP_REPO_URL) \
	--build-arg APP_DIR=$(APP_DIR)

deploy-image-coordinator:
	docker push $(REPO_BASE)/$(COORDINATOR_REPO):$(TAG)

SECURITY_REPO?=cch-security
SECURITY_CHAIN_ID?=securityz
SECURITY_MNEMONIC?="uncle wink forum finish collect midnight capable park fabric quarter seed abuse curve market choice base execute initial bulb title enrich spread exit update"

build-image-security:
	cd chain && docker build . -t $(REPO_BASE)/$(SECURITY_REPO):$(TAG) \
	--build-arg CHAIN_ID=$(SECURITY_CHAIN_ID) \
	--build-arg MNEMONIC=$(SECURITY_MNEMONIC) \
	--build-arg REPO_URL=$(APP_REPO_URL) \
	--build-arg APP_DIR=$(APP_DIR)

deploy-image-security:
	docker push $(REPO_BASE)/$(SECURITY_REPO):$(TAG)

COIN_REPO?=cch-coin
COIN_CHAIN_ID?=coinz
COIN_MNEMONIC?="uncle wink forum finish collect midnight capable park fabric quarter seed abuse curve market choice base execute initial bulb title enrich spread exit update"

build-image-coin:
	cd chain && docker build . -t $(REPO_BASE)/$(COIN_REPO):$(TAG) \
	--build-arg CHAIN_ID=$(COIN_CHAIN_ID) \
	--build-arg MNEMONIC=$(COIN_MNEMONIC) \
	--build-arg REPO_URL=$(APP_REPO_URL) \
	--build-arg APP_DIR=$(APP_DIR)

deploy-image-coin:
	docker push $(REPO_BASE)/$(COIN_REPO):$(TAG)

RELAYER_REPO=cch-relayer
build-image-relayer:
	cd relayer && docker build . -t $(REPO_BASE)/$(RELAYER_REPO):$(TAG)

deploy-image-relayer:
	docker push $(REPO_BASE)/$(RELAYER_REPO):$(TAG)

API_REPO=cch-api
build-image-api:
	cd api && docker build . -t $(REPO_BASE)/$(API_REPO):$(TAG)

deploy-image-api:
	docker push $(REPO_BASE)/$(API_REPO):$(TAG)

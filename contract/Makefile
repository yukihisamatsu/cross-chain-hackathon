.PHONY: build test e2e-test

build:
	go build -mod readonly -o build/simappd ./cmd/simappd
	go build -mod readonly -o build/simappcli ./cmd/simappcli

test:
	go test -v -count=1 ./...

lint:
	golangci-lint run ./...

e2e-test:
	$(MAKE) -C ./tests e2e-test

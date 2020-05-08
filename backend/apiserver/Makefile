GO?=go

DB_PATH=$(CURDIR)/demo.db

.PHONY: build run

build:
	go build --mod=readonly -a -installsuffix cgo -o apiserver .

run:
	DB_PATH=${DB_PATH} go run ${shell pwd}/main.go

setup-db: migrate-reset migrate-up
	$(CURDIR)/scripts/initdata.sh

migrate-reset:
	goose -dir $(CURDIR)/db/migrations sqlite3 ${DB_PATH} reset

migrate-up:
	goose -dir $(CURDIR)/db/migrations sqlite3 ${DB_PATH} up

migrate-down:
	goose -dir $(CURDIR)/db/migrations sqlite3 ${DB_PATH} down

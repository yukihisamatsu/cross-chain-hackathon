FROM golang:alpine AS build-env

ARG CHAIN_ID
ARG REPO_URL

# Set up dependencies
ENV PACKAGES make git bash

# Set working directory for the build
WORKDIR /root

ADD ./build.sh .
ADD ./gen-config.sh .

# TODO give env variables from outside?
RUN apk add --no-cache $PACKAGES && \
    bash ./build.sh && \
    CHAIN_ID=$CHAIN_ID NODE_DATA=./data NODE_NAME=simappcli NODED_NAME=simappd bash ./gen-config.sh

RUN go get github.com/mattn/goreman

# Final image
FROM alpine:edge

ARG CHAIN_ID

# Install ca-certificates
RUN apk add --update ca-certificates
WORKDIR /root

ADD ./Procfile /root/Procfile

# Copy over binaries and data from the build-env
COPY --from=build-env /go/bin/goreman /usr/bin/goreman
COPY --from=build-env /usr/bin/simappd /usr/bin/simappd
COPY --from=build-env /usr/bin/simappcli /usr/bin/simappcli
COPY --from=build-env /root/data /root/data

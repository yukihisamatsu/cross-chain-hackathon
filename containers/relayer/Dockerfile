FROM golang:alpine AS build-env

# Set up dependencies
ENV PACKAGES make git

# Set working directory for the build
WORKDIR /root

ADD ./build.sh .

RUN apk add --no-cache $PACKAGES && \
    sh ./build.sh

ENV DOCKERIZE_VERSION v0.6.1
RUN apk add --no-cache openssl \
 && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
 && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
 && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Final image
FROM alpine:edge

# Set up dependencies
ENV PACKAGES bash jq

# Install ca-certificates
RUN apk add --no-cache $PACKAGES && \
    apk add --update ca-certificates

WORKDIR /root

# Copy over binaries and data from the build-env
COPY --from=build-env /usr/bin/rly /usr/bin/rly
COPY --from=build-env /usr/local/bin/dockerize /usr/bin/dockerize

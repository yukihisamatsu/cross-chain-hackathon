FROM golang:alpine AS build-env

ARG REPO_URL
ARG APP_DIR 

# TODO
ENV PACKAGES make git bash

WORKDIR /root

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN apk add --no-cache $PACKAGES

COPY ./build.sh .
RUN bash ./build.sh

FROM alpine:edge

ENV PACKAGES bash jq

RUN apk add --no-cache $PACKAGES

WORKDIR /root

# Copy over binaries and data from the build-env
COPY --from=build-env /usr/bin/simappcli /usr/bin/simappcli
COPY --from=build-env /usr/bin/simappd /usr/bin/simappd
COPY --from=build-env /usr/local/bin/dockerize /usr/bin/dockerize

COPY ./initdata.sh /root/initdata.sh
RUN chmod a+x /root/initdata.sh

ENTRYPOINT ["./initdata.sh"]

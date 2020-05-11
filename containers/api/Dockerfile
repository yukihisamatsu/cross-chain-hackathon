FROM golang:alpine AS build-dev
WORKDIR /root/src

ENV PACKAGES make gcc g++ git bash
RUN apk add --no-cache $PACKAGES

ADD ./build.sh .
RUN bash ./build.sh

RUN CGO_ENABLED=1 go get -u github.com/pressly/goose/cmd/goose

FROM alpine:edge AS runtime

ENV PACKAGES sqlite make bash
ENV BUILD_DIR /root/src/cross-chain-hackathon/backend/apiserver

WORKDIR /root/api

RUN apk add --no-cache $PACKAGES

COPY --from=build-dev /go/bin/goose /usr/local/bin/goose
COPY --from=build-dev $BUILD_DIR/apiserver /usr/local/bin/apiserver
COPY --from=build-dev $BUILD_DIR/db /root/api/db/
COPY --from=build-dev $BUILD_DIR/scripts /root/api/scripts/
COPY --from=build-dev $BUILD_DIR/Makefile /root/api/Makefile
COPY --from=build-dev $BUILD_DIR/config.demo.yaml /root/api/config.yaml

EXPOSE 8080/tcp

FROM golang:alpine

ARG REPO_URL
ARG APP_DIR 

# TODO
ENV PACKAGES make git bash jq

WORKDIR /root

ADD ./build.sh .
ADD ./initdata.sh .

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN apk add --no-cache $PACKAGES && \
    bash ./build.sh && \
    chmod a+x ./initdata.sh

ENTRYPOINT ["./initdata.sh"]


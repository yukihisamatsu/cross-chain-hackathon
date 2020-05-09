FROM golang:alpine

ARG REPO_URL
ARG APP_DIR 

# TODO
ENV PACKAGES make git bash jq

WORKDIR /root

ADD ./build.sh .
ADD ./initdata.sh .

RUN apk add --no-cache $PACKAGES && \
    bash ./build.sh && \
    chmod a+x ./initdata.sh

ENTRYPOINT ["./initdata.sh"]


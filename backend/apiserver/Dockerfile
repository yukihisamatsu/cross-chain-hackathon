FROM golang:1.14 AS build
WORKDIR /go/src
COPY api ./api
COPY rdb ./rdb
COPY main.go .
COPY go.mod .
COPY go.sum .
COPY config.demo.yaml ./config.yaml

ENV CGO_ENABLED=0
RUN go get -d -v ./...

RUN go build --mod=readonly -a -installsuffix cgo -o apiserver .

FROM scratch AS runtime
COPY --from=build /go/src/apiserver ./
EXPOSE 8080/tcp

ENTRYPOINT ["./apiserver"]

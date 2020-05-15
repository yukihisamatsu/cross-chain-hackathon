#!/usr/bin/env bats

load helper

# after migration
@test "trade should be empty at first" {
    run ${CURL} -X GET ${URL}/estates
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '. | length')" -ge 0 ]
    [ "$(echo ${output} | jq -r '. [0].trades')" == "[]" ]
    [ "$(echo ${output} | jq -r '. [0].tokenId')" == "1" ]
}

@test "post a new trade" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"1","unitPrice":100,"amount":5,"seller":"'${ALICE_ADDR}'","type":1}'
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.id')" -eq 1 ]
    [ "$(echo ${output} | jq -r '.unitPrice')" -eq 100 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 0 ]
}

@test "get an posted trade by /api/estates" {
    run ${CURL} -X GET ${URL}/estates
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '. [0].trades[0].id')" == "1" ]
}

@test "get an posted trade by /api/estate/1" {
    run ${CURL} -X GET ${URL}/estate/1
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.trades[0].id')" == "1" ]
}

@test "cancel the trade" {
    run ${CURL} -X DELETE ${URL}/trade/1
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 1 ]
}

@test "post another trade" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"1","unitPrice":10,"amount":3,"seller":"'${ALICE_ADDR}'","type":1}'
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.id')" -eq 2 ]
    [ "$(echo ${output} | jq -r '.unitPrice')" -eq 10 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 0 ]
}

@test "post a new trade request for trade" {
    run ${CURL} -X POST ${URL}/trade_requests -d '{"tradeId":2,"from":"'${BOB_ADDR}'","crossTx":'${SAMPLE_CROSS_TX}'}'
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.id')" -eq 1 ]
    [ "$(echo ${output} | jq -r '.from')" == "${BOB_ADDR}" ]
    [ "$(echo ${output} | jq -r '.status')" -eq 0 ]
}

@test "get the trade request by id" {
    run ${CURL} -X GET ${URL}/trade_request/1
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 0 ]
}

@test "get the trade requests by a user" {
    run ${CURL} -X GET "${URL}/trade_requests?userId=${BOB_ADDR}"
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '. | length')" -eq 1 ]
}

@test "cancel the trade request" {
    run ${CURL} -X DELETE ${URL}/trade_request/1
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 1 ]
}

@test "get the trade with requests" {
    run ${CURL} -X GET ${URL}/trade/2
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.requests | length')" -eq 1 ]
}


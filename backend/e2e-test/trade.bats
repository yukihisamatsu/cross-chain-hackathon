#!/usr/bin/env bats

load helper

# after migration
@test "trade should be empty at first" {
    run ${CURL} -X GET ${URL}/estates
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '. | length') > 0 ]
    [ $(echo ${output} | jq -r '. [0].trades') == "[]" ]
    [ $(echo ${output} | jq -r '. [0].tokenId') == "1" ]
}

@test "post a new trade" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"1","unitPrice":100,"amount":5,"seller":"seller","type":1}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.id') == 1 ]
    [ $(echo ${output} | jq -r '.unitPrice') == 100 ]
    [ $(echo ${output} | jq -r '.status') == 0 ]
}

@test "get an posted trade by /api/estates" {
    run ${CURL} -X GET ${URL}/estates
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '. [0].trades[0].id') == "1" ]
}

@test "get an posted trade by /api/estate/1" {
    run ${CURL} -X GET ${URL}/estate/1
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.trades[0].id') == "1" ]
}

@test "cancel the trade" {
    run ${CURL} -X PUT ${URL}/trades -d '{"id":1,"status":1}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.status') == 1 ]
}

@test "modifying the trade status after cancel should be fail" {
    run ${CURL} -X PUT ${URL}/trades -d '{"id":1,"status":2}'
    [ $status != 0 ]
}

@test "post another trade" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"1","unitPrice":10,"amount":3,"seller":"seller","type":1}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.id') == 2 ]
    [ $(echo ${output} | jq -r '.unitPrice') == 10 ]
    [ $(echo ${output} | jq -r '.status') == 0 ]
}

@test "post a new trade request for trade" {
    run ${CURL} -X POST ${URL}/trade/requests -d '{"tradeId":2,"from":"buyer","crossTx":'${SAMPLE_CROSS_TX}'}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.id') == 1 ]
    [ $(echo ${output} | jq -r '.from') == "buyer" ]
    [ $(echo ${output} | jq -r '.status') == 0 ]
}

@test "put the trade as completed" {
    run ${CURL} -X PUT ${URL}/trade/requests -d '{"id":1,"status":3}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.id') == 1 ]
    [ $(echo ${output} | jq -r '.status') == 3 ]
}

@test "completed request update the trade status" {
    run ${CURL} -X GET ${URL}/estate/1
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.trades[1].id') == 2 ]
    [ $(echo ${output} | jq -r '.trades[1].status') == 2 ]
}

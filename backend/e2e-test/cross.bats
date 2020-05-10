#!/usr/bin/env bats

load helper

# after migration
@test "create a new trade for prepare" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"2","unitPrice":100,"amount":5,"seller":"'${ALICE_ADDR}'","type":1}'
    [ $status = 0 ]
    [ $(echo ${output} | jq -r '.id') == 3 ]
    [ $(echo ${output} | jq -r '.seller') == ${ALICE_ADDR} ]
    [ $(echo ${output} | jq -r '.unitPrice') == 100 ]
    [ $(echo ${output} | jq -r '.amount') == 5 ]
    [ $(echo ${output} | jq -r '.status') == 0 ]
}

@test "get a cross tx" {
    run ${CURL} -X GET "${URL}/tx/trade/request?tradeId=3&from=${BOB_ADDR}"
    [ $status = 0 ]
} 

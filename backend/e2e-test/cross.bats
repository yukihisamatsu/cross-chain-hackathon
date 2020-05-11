#!/usr/bin/env bats

load helper

# after migration
@test "create a new trade for prepare" {
    run ${CURL} -X POST ${URL}/trades -d '{"estateId":"2","unitPrice":100,"amount":5,"seller":"'${ALICE_ADDR}'","type":1}'
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.id')" -eq 3 ]
    [ "$(echo ${output} | jq -r '.seller')" == "${ALICE_ADDR}" ]
    [ "$(echo ${output} | jq -r '.unitPrice')" -eq 100 ]
    [ "$(echo ${output} | jq -r '.amount')" -eq 5 ]
    [ "$(echo ${output} | jq -r '.status')" -eq 0 ]
}

@test "get a cross tx" {
    run ${CURL} -X GET "${URL}/tx/trade/request?tradeId=3&from=${BOB_ADDR}"
    [ "$(echo ${output} | jq -r '.value.msg[0].value.Sender')" == "${ALICE_ADDR}" ]
    [ "$(echo ${output} | jq -r '.value.msg[0].value.ChainID')" == "coordinatorz" ]
    [ "$(echo ${output} | jq -r '.value.msg[0].value.ContractTransactions[0].signers[0]')" == "${BOB_ADDR}" ]
    [ "$(echo ${output} | jq -r '.value.msg[0].value.ContractTransactions[1].signers[0]')" == "${ALICE_ADDR}" ]
    [ "$status" -eq 0 ]
} 

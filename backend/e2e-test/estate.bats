#!/usr/bin/env bats

load helper

# after migration
@test "get estates" {
    run ${CURL} -X GET ${URL}/estates
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '. | length')" -ge 0 ]
    [ "$(echo ${output} | jq -r '. [0].tokenId')" == "1" ]
}

@test "get estate by id" {
    run ${CURL} -X GET ${URL}/estate/1
    [ "$status" -eq 0 ]
    [ "$(echo ${output} | jq -r '.tokenId')" == "1" ]
}

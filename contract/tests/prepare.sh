#!/bin/bash
set -e

NODE_CLI=$(pwd)/../build/simappcli

CO_NODE=tcp://localhost:26657
DCC_NODE=tcp://localhost:26557
SEC_NODE=tcp://localhost:26457
CO_CHAIN=ibc0
DCC_CHAIN=ibc1
SEC_CHAIN=ibc2
CO_HOME=./data/ibc0/n0/simappcli
DCC_HOME=./data/ibc1/n0/simappcli
SEC_HOME=./data/ibc2/n0/simappcli
WAIT_NEW_BLOCK=3s

ACC0=n0

ISSUER_ADDR=cosmos135ue4mn7mwjdxwxf5kzm5q7d9vtyny93jsvttm
ALICE_ADDR=cosmos1hxjcv2ya78j2pcrsjx3vhnalw50k9rpks5ghyh
BOB_ADDR=cosmos1f5480yg3wrsjfcn474pcljtecnmhxmvdvpumhg
CAROL_ADDR=cosmos1a8nc48p5cr4qsyzma45yw85lfu6c3uzanyuqdy
DAVE_ADDR=cosmos1mwfgn45s8emq4a69ux44jpcth7cjes9mmka6na
TRUDY_ADDR=cosmos1u426tjsk6ld9am309s0tgwnpvsdycuhzxfjxwc

MINT_ADDR=(${ISSUER_ADDR} ${ALICE_ADDR} ${BOB_ADDR} ${CAROL_ADDR} ${DAVE_ADDR} ${TRUDY_ADDR})
WHITELIST_ADDR=(${ISSUER_ADDR} ${ALICE_ADDR} ${BOB_ADDR} ${CAROL_ADDR} ${DAVE_ADDR})

hex64 () {
    printf "0x%016x" $1
}

# mint DCC to everyone
AMOUNT=$(hex64 1000000)
for a in "${MINT_ADDR[@]}"
do
    echo "mint DCC to $a"
    TX_ID=$(${NODE_CLI} tx contract call --node ${DCC_NODE} dcc mint $a ${AMOUNT} --from ${ACC0} --home ${DCC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    #${NODE_CLI} query tx ${TX_ID} --node ${DCC_NODE} --chain-id ${DCC_CHAIN} -o json --trust-node | jq .
done

# create estate tokens
ESTATE_AMOUNT=(1000 1000 500 1000 800 1500)
for es in "${ESTATE_AMOUNT[@]}"
do
    echo "create an estate with amount $es"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate create $(hex64 $es) '' --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    #${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node | jq .
done

for a in "${WHITELIST_ADDR[@]}"
do
    echo "add $a to the issuer's whitelist"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate addToWhitelist $a --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    #${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node | jq .
done
 
exit 0

# Transfer estates
#echo "transfer the estate 0 to ${ALICE_ADDRESS}"
#TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer ${ALICE_ADDR} --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
#sleep ${WAIT_NEW_BLOCK} 

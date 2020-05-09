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

# ACC0 
ISSUER_ADDR=cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02
ALICE_ADDR=cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9
BOB_ADDR=cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498
CAROL_ADDR=cosmos146av9w44gewl25u0g5a73j0m4arqrqlmp06587
DAVE_ADDR=cosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4
TRUDY_ADDR=cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4

MINT_ADDR=(${ISSUER_ADDR} ${ALICE_ADDR} ${BOB_ADDR} ${CAROL_ADDR} ${DAVE_ADDR} ${TRUDY_ADDR})
WHITELIST_ADDR=(${ISSUER_ADDR} ${ALICE_ADDR} ${BOB_ADDR} ${CAROL_ADDR} ${DAVE_ADDR})

hex64 () {
    printf "0x%016x" $1
}
hex32 () {
    printf "0x%08x" $1
}

# mint DCC to everyone
AMOUNT=$(hex64 1000000)
COIN=$(hex32 100000)
for a in "${MINT_ADDR[@]}"; do
    echo "create an account of $a at CO"
    TX_ID=$(${NODE_CLI} tx send ${ISSUER_ADDR} $a 100000n0token --node ${CO_NODE} --from ${ACC0} --home ${CO_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${CO_NODE} --chain-id ${CO_CHAIN} -o json --trust-node

    echo "mint DCC to $a"
    TX_ID=$(${NODE_CLI} tx contract call --node ${DCC_NODE} dcc mint $a ${AMOUNT} --from ${ACC0} --home ${DCC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${DCC_NODE} --chain-id ${DCC_CHAIN} -o json --trust-node
done

# create estate tokens
ESTATE_AMOUNT=(1000 1000 500 1000 800 1500)
for es in "${ESTATE_AMOUNT[@]}"; do
    echo "create an estate with amount $es"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate create $(hex64 $es) '' --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node
done

for a in "${WHITELIST_ADDR[@]}"; do
    echo "add $a to the issuer's whitelist"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate addToWhitelist $a --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node
done


# need same length
TO=(${ALICE_ADDR} ${ALICE_ADDR} ${CAROL_ADDR} ${DAVE_ADDR} ${ALICE_ADDR} ${DAVE_ADDR} ${ALICE_ADDR} ${ALICE_ADDR})
AM=(999 1000 500 500 500 800 500 1000)
IDX=(1 2 2 2 3 4 5 6)
 
# Transfer estates
for i in "${!TO[@]}"; do 
    echo "transfer the estate ${IDX[$i]} to ${TO[$i]}"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 ${IDX[$i]}) ${TO[$i]} $(hex64 ${AM[$i]}) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node
done

exit 0

echo "transfer the estate 2 to ${ALICE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 2) ${ALICE_ADDR} $(hex64 1000) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 2 to ${CAROL_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 2) ${CAROL_ADDR} $(hex64 500) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 2 to ${DAVE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 2) ${DAVE_ADDR} $(hex64 500) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 3 to ${ALICE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 3) ${ALICE_ADDR} $(hex64 500) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 4 to ${DAVE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 4) ${DAVE_ADDR} $(hex64 800) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 5 to ${ALICE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 5) ${ALICE_ADDR} $(hex64 500) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node

echo "transfer the estate 6 to ${ALICE_ADDR}"
TX_ID=$(${NODE_CLI} tx contract call --node ${SEC_NODE} estate transfer $(hex64 6) ${ALICE_ADDR} $(hex64 1000) --from ${ACC0} --home ${SEC_HOME} --keyring-backend=test --yes | jq -r '.txhash')
sleep ${WAIT_NEW_BLOCK} 
${NODE_CLI} query tx ${TX_ID} --node ${SEC_NODE} --chain-id ${SEC_CHAIN} -o json --trust-node


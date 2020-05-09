#!/bin/bash
set -xe

NODE_CLI=${NODE_CLI:-simappcli}
COORDINATOR_HOME=${COORDINATOR_HOME:-./cli/coordinatorz/simappcli}
COIN_HOME=${COIN_HOME:-./cli/coinz/simappcli}
SECURITY_HOME=${SECURITY_HOME:-./cli/securityz/simappcli}

COORDINATOR_NODE=${COORDINATOR_NODE:-tcp://coordinatorz:26657}
COIN_NODE=${COIN_NODE:-tcp://coinz:26657}
SECURITY_NODE=${SECURITY_NODE:-tcp://securityz:26657}

COORDINATOR_CHAIN=coordinatorz
COIN_CHAIN=coinz
SECURITY_CHAIN=securityz
WAIT_NEW_BLOCK=6s

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

# wait to get the latest height
sleep 15s

# mint DCC to everyone
AMOUNT=$(hex64 1000000)
COIN=$(hex32 100000)
for a in "${MINT_ADDR[@]}"; do
    echo "create an account of $a at CO"
    TX_ID=$(${NODE_CLI} tx send ${ISSUER_ADDR} $a 100000n0token --node ${COORDINATOR_NODE} --from ${ACC0} --home ${COORDINATOR_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${COORDINATOR_NODE} --chain-id ${COORDINATOR_CHAIN} -o json --trust-node

    echo "mint DCC to $a"
    TX_ID=$(${NODE_CLI} tx contract call --node ${COIN_NODE} dcc mint $a ${AMOUNT} --from ${ACC0} --home ${COIN_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${COIN_NODE} --chain-id ${COIN_CHAIN} -o json --trust-node
done

# create estate tokens
ESTATE_AMOUNT=(1000 1000 500 1000 800 1500)
for es in "${ESTATE_AMOUNT[@]}"; do
    echo "create an estate with amount $es"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SECURITY_NODE} estate create $(hex64 $es) '' --from ${ACC0} --home ${SECURITY_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SECURITY_NODE} --chain-id ${SECURITY_CHAIN} -o json --trust-node
done

# setup whitelist
for a in "${WHITELIST_ADDR[@]}"; do
    echo "add $a to the issuer's whitelist"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SECURITY_NODE} estate addToWhitelist $a --from ${ACC0} --home ${SECURITY_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SECURITY_NODE} --chain-id ${SECURITY_CHAIN} -o json --trust-node
done

TO=(${ALICE_ADDR} ${ALICE_ADDR} ${CAROL_ADDR} ${DAVE_ADDR} ${ALICE_ADDR} ${DAVE_ADDR} ${ALICE_ADDR} ${ALICE_ADDR})
AM=(999 1000 500 500 500 800 500 1000)
IDX=(1 2 2 2 3 4 5 6)
# Transfer estates
for i in "${!TO[@]}"; do 
    echo "transfer the estate ${IDX[$i]} to ${TO[$i]}"
    TX_ID=$(${NODE_CLI} tx contract call --node ${SECURITY_NODE} estate transfer $(hex64 ${IDX[$i]}) ${TO[$i]} $(hex64 ${AM[$i]}) --from ${ACC0} --home ${SECUIRTY_HOME} --keyring-backend=test --yes | jq -r '.txhash')
    sleep ${WAIT_NEW_BLOCK} 
    ${NODE_CLI} query tx ${TX_ID} --node ${SECURITY_NODE} --chain-id ${SECURITY_CHAIN} -o json --trust-node
done

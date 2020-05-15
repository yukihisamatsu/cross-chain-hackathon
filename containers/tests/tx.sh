#!/bin/bash
set -eux

hex64 () {
    printf "0x%016x" $1
}

ALICE_ADDR=cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9
BOB_ADDR=cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498
COIN_CALL=${COIN_CALL:-dcc transfer ${ALICE_ADDR} $(hex64 1)}
SECURITY_CALL=${SECURITY_CALL:-estate transfer $(hex64 1) ${BOB_ADDR} $(hex64 1)}

echo ${COIN_CALL}
echo ${SECURITY_CALL}

NODE_CLI=${NODE_CLI:-../contract/build/simappcli}
COORDINATOR_HOME=${COORDINATOR_HOME:-./data/cli/coordinatorz/simappcli}
COIN_HOME=${COIN_HOME:-./data/cli/coinz/simappcli}
SECURITY_HOME=${SECURITY_HOME:-./data/cli/securityz/simappcli}

ALICE_HOME=${ALICE_HOME:-./data/cli/alice}
BOB_HOME=${BOB_HOME:-./data/cli/bob}

COORDINATOR_NODE=${COORDINATOR_NODE:-tcp://localhost:26657}
SECURITY_NODE=${SECURITY_NODE:-tcp://localhost:26660}
COIN_NODE=${COIN_NODE:-tcp://localhost:26662}

COORDINATOR_ID=${COORDINATOR_ID:-coordinatorz}
SECURITY_ID=${SECURITY_ID:-securityz}
COIN_ID=${COIN_ID:-coinz}

# 0: coordinatorz, 1: coinz, 2: securityz
RELAYER_CONF_DIR=${RELAYER_CONF_DIR:-./data/demo}
PATH01_CONF=${RELAYER_CONF_DIR}/path-coordinatorz-coinz.json
PATH02_CONF=${RELAYER_CONF_DIR}/path-coordinatorz-securityz.json

SRC01_CHAN=$(cat ${PATH01_CONF} | jq -r '.src."channel-id"')
SRC01_PORT=$(cat ${PATH01_CONF} | jq -r '.src."port-id"')
DST01_CHAN=$(cat ${PATH01_CONF} | jq -r '.dst."channel-id"')
DST01_PORT=$(cat ${PATH01_CONF} | jq -r '.dst."port-id"')

SRC02_CHAN=$(cat ${PATH02_CONF} | jq -r '.src."channel-id"')
SRC02_PORT=$(cat ${PATH02_CONF} | jq -r '.src."port-id"')
DST02_CHAN=$(cat ${PATH02_CONF} | jq -r '.dst."channel-id"')
DST02_PORT=$(cat ${PATH02_CONF} | jq -r '.dst."port-id"')

SAVE_DIR=${SAVE_DIR:-./data/test}

${NODE_CLI} query --home ${BOB_HOME} contract call --node ${COIN_NODE} --chain-id ${COIN_ID} --from bob --keyring-backend=test \
    ${COIN_CALL} --save ${SAVE_DIR}/coin.json
${NODE_CLI} query --home ${ALICE_HOME} contract call --node ${SECURITY_NODE} --chain-id ${SECURITY_ID} --from alice --keyring-backend=test \
    ${SECURITY_CALL} --save ${SAVE_DIR}/security.json

LATEST_HEIGHT=$(${NODE_CLI} --home ${COORDINATOR_HOME} status | jq -r '.sync_info.latest_block_height')

# bob creates a tx
${NODE_CLI} tx --home ${BOB_HOME} cross create --from ${ALICE_ADDR} --keyring-backend=test --yes \
    --chain-id ${COORDINATOR_ID} \
    --contract ${SAVE_DIR}/coin.json --channel ${SRC01_CHAN}:${SRC01_PORT} \
    --contract ${SAVE_DIR}/security.json --channel ${SRC02_CHAN}:${SRC02_PORT} \
    --generate-only \
    --offline \
    $((${LATEST_HEIGHT}+100)) 0 > ${SAVE_DIR}/txNoSigned.json

# alice signs (in demo, bob signs at first)
${NODE_CLI} tx --home ${ALICE_HOME} sign ${SAVE_DIR}/txNoSigned.json --from ${ALICE_ADDR} --keyring-backend=test --yes \
    --chain-id ${COORDINATOR_ID} > ${SAVE_DIR}/txAliceSigned.json

# bob signs
${NODE_CLI} tx --home ${BOB_HOME} sign ${SAVE_DIR}/txALiceSigned.json --from ${BOB_ADDR} --keyring-backend=test --yes \
    --chain-id ${COORDINATOR_ID} > ${SAVE_DIR}/txBothSigned.json

# alice broadcast
TX_HASH=$(${NODE_CLI} tx --home ${ALICE_HOME} broadcast ${SAVE_DIR}/txBothSigned.json --from ${ALICE_ADDR} --keyring-backend=test \
    --node ${COORDINATOR_NODE} --output json | jq -r '.txhash') 
echo TX_HASH=${TX_HASH}

sleep 5s

TX_ID=$(${NODE_CLI} query tx ${TX_HASH} --node ${COORDINATOR_NODE} --chain-id ${COORDINATOR_ID} -o json | jq -r '.data')
echo TX_ID=${TX_ID}

sleep 10s

### Ensure coordinator status is done
STATUS=$(${NODE_CLI} query cross coordinator ${TX_ID} | jq -r '.completed')
if [ ${STATUS} = "true" ]; then
  echo "completed!"
else
  echo "failed"
  exit 1
fi
###

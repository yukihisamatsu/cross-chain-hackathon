#!/bin/bash
set -e

COIN_CALL=${COIN_CALL:-train reserve 0x00000001}
SECURITY_CALL=${SECURITY_CALL:-hotel reserve 0x00000002}

NODE_CLI=${NODE_CLI:-simappcli}
COORDINATOR_HOME=${COORDINATOR_HOME:-./data/cli/coordinatorz/simappcli}
COIN_HOME=${COIN_HOME:-./data/cli/coinz/simappcli}
SECURITY_HOME=${SECURITY_HOME:-./data/cli/securityz/simappcli}

COORDINATOR_NODE=${COORDINATOR_NODE:-tcp://localhost:26657}
COIN_NODE=${COIN_NODE:-tcp://localhost:26662}
SECURITY_NODE=${SECURITY_NODE:-tcp://localhost:26660}

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

${NODE_CLI} query --home ${COORDINATOR_HOME} contract call --node ${COIN_NODE} --from n0 --keyring-backend=test ${COIN_CALL} --save ./train.json
${NODE_CLI} query --home ${COORDINATOR_HOME} contract call --node ${SECURITY_NODE} --from n0 --keyring-backend=test ${SECURITY_CALL} --save ./hotel.json

LATEST_HEIGHT=$(${NODE_CLI} --home ${COORDINATOR_HOME} status | jq -r '.sync_info.latest_block_height')
RES=$(${NODE_CLI} tx --home ${COORDINATOR_HOME} cross create --from n0 --keyring-backend=test --yes \
    --contract ./train.json --channel ${SRC01_CHAN}:${SRC01_PORT} \
    --contract ./hotel.json --channel ${SRC02_CHAN}:${SRC02_PORT} \
    $((${LATEST_HEIGHT}+100)) 0)
echo ${RES} | jq
echo TX_ID=$(echo ${RES} | jq -r '.data')

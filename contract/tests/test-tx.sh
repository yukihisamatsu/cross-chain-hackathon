#!/bin/bash
set -ex

# Ensure jq is installed
if [[ ! -x "$(which jq)" ]]; then
  echo "jq (a tool for parsing json in the command line) is required..."
  echo "https://stedolan.github.io/jq/download/"
  exit 1
fi

RELAYER_CMD="${RELAYER_CLI} --home $(pwd)/.relayer"
NODE_CLI=$(pwd)/../build/simappcli
# NODE_URL
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

ALICE_ADDR=cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9

hex64 () {
    printf "0x%016x" $1
}

# Get contract ops from each nodes
${NODE_CLI} query --home ${CO_HOME} contract call --node ${DCC_NODE} --from ${ACC0} --keyring-backend=test dcc mint ${ALICE_ADDR} $(hex64 100) --chain-id ${DCC_CHAIN} --save ./data/dcc.json
${NODE_CLI} query --home ${CO_HOME} contract call --node ${SEC_NODE} --from ${ACC0} --keyring-backend=test estate create $(hex64 1000) '' --chain-id ${SEC_CHAIN} --save ./data/sec.json

SRC01_CHAN=$(${RELAYER_CMD} paths show path01 --json | jq -r '.chains.src."channel-id"')
SRC01_PORT=$(${RELAYER_CMD} paths show path01 --json | jq -r '.chains.src."port-id"')
DST01_CHAN=$(${RELAYER_CMD} paths show path01 --json | jq -r '.chains.dst."channel-id"')
DST01_PORT=$(${RELAYER_CMD} paths show path01 --json | jq -r '.chains.dst."port-id"')

SRC02_CHAN=$(${RELAYER_CMD} paths show path02 --json | jq -r '.chains.src."channel-id"')
SRC02_PORT=$(${RELAYER_CMD} paths show path02 --json | jq -r '.chains.src."port-id"')
DST02_CHAN=$(${RELAYER_CMD} paths show path02 --json | jq -r '.chains.dst."channel-id"')
DST02_PORT=$(${RELAYER_CMD} paths show path02 --json | jq -r '.chains.dst."port-id"')

RELAYER0=$(${NODE_CLI} --home ${CO_HOME} --keyring-backend=test keys show ${ACC0} -a)
RELAYER1=$(${NODE_CLI} --home ${DCC_HOME} --keyring-backend=test keys show ${ACC0} -a)
RELAYER2=$(${NODE_CLI} --home ${SEC_HOME} --keyring-backend=test keys show ${ACC0} -a)

echo "==> (Re)starting the relayer"
PID=$(pgrep rly || echo "")
if [[ $PID != "" ]]; then
	pkill rly
fi

${RELAYER_CMD} start path01 &
${RELAYER_CMD} start path02 &

### Broadcast MsgInitiate
LATEST_HEIGHT=$(${NODE_CLI} --home ${CO_HOME} status | jq -r '.sync_info.latest_block_height')
TX_ID=$(${NODE_CLI} tx --home ./data/ibc0/n0/simappcli cross create --from ${ACC0} --keyring-backend=test --chain-id ${CO_CHAIN} --yes \
    --contract ./data/dcc.json --channel ${SRC01_CHAN}:${SRC01_PORT} \
    --contract ./data/sec.json --channel ${SRC02_CHAN}:${SRC02_PORT} \
    $((${LATEST_HEIGHT}+100)) 0 | jq -r '.data')
###

sleep 20

### Ensure coordinator status is done
STATUS=$(${NODE_CLI} query --home ${CO_HOME} cross coordinator ${TX_ID} | jq -r '.completed')
if [ ${STATUS} = "true" ]; then
  echo "completed!"
else
  echo "failed"
  exit 1
fi
###

echo "==> Stopping the relayer"
pkill rly

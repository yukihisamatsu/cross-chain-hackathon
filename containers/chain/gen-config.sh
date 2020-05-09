#!/bin/bash
set -ex

NODE_CLI=${NODE_NAME}
NODED_CLI=${NODED_NAME}

echo "Generating gaia configurations..."
mkdir -p $NODE_DATA && cd $NODE_DATA

echo -e "\n" | ${NODED_CLI} testnet -o ${CHAIN_ID} --v 1 --chain-id ${CHAIN_ID} --node-dir-prefix n --keyring-backend test --mnemonic "${MNEMONIC}" &> /dev/null

cfgpth="n0/${NODED_NAME}/config/config.toml"

# Make blocks run faster than normal
sed -i 's/timeout_commit = "5s"/timeout_commit = "1s"/g' ${CHAIN_ID}/$cfgpth
sed -i 's/timeout_propose = "3s"/timeout_propose = "1s"/g' ${CHAIN_ID}/$cfgpth

gclpth="n0/${NODE_NAME}/"
${NODE_CLI} config --home ${CHAIN_ID}/$gclpth chain-id ${CHAIN_ID} &> /dev/null
${NODE_CLI} config --home ${CHAIN_ID}/$gclpth output json &> /dev/null
${NODE_CLI} config --home ${CHAIN_ID}/$gclpth node http://localhost:26657 &> /dev/null

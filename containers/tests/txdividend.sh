#!/bin/bash
set -eux

hex64 () {
    printf "0x%016x" $1
}

SECURITY_CALL=${SECURITY_CALL:-estate registerDividend $(hex64 2) $(hex64 10)}

NODE_CLI=${NODE_CLI:-../contract/build/simappcli}
SECURITY_HOME=${SECURITY_HOME:-./data/cli/securityz/simappcli}
SECURITY_NODE=${SECURITY_NODE:-tcp://localhost:26660}
SECURITY_ID=${SECURITY_ID:-securityz}

SAVE_DIR=${SAVE_DIR:-./data/test}

${NODE_CLI} tx --home ${SECURITY_HOME} contract call --node ${SECURITY_NODE} --chain-id ${SECURITY_ID} --from n0 --keyring-backend=test -y \
    ${SECURITY_CALL}

#!/bin/bash
set -ex

# Wait for chains
dockerize -wait http://coordinatorz:26657 \
          -wait http://coinz:26657 \
          -wait http://securityz:26657

NODE_NAME=simappcli
RELAYER_HOME=/root/.relayer
RELAYER_CMD="rly --home ${RELAYER_HOME}"

if [ -e ${RELAYER_HOME}/config/config.yaml ]; then
   echo "relayer has already been initialized"
   exit 0
fi

sleep 3

# First initialize your configuration for the relayer
${RELAYER_CMD} config init

# Then add the chains and paths that you will need to work with the 
# gaia chains spun up by the two-chains script
${RELAYER_CMD} chains add -f /root/data/demo/coordinatorz.json
${RELAYER_CMD} chains add -f /root/data/demo/coinz.json
${RELAYER_CMD} chains add -f /root/data/demo/securityz.json

# To finalize your config, add a path between the two chains
${RELAYER_CMD} paths add coordinatorz coinz coordinatorz-coinz -f /root/data/demo/path-coordinatorz-coinz.json
${RELAYER_CMD} paths add coordinatorz securityz coordinatorz-securityz -f /root/data/demo/path-coordinatorz-securityz.json

# Now, add the key seeds from each chain to the relayer to give it funds to work with
${RELAYER_CMD} keys restore coordinatorz testkey "$(jq -r '.secret' /root/data/cli/coordinatorz/simappcli/key_seed.json)"
${RELAYER_CMD} keys restore coinz testkey "$(jq -r '.secret' /root/data/cli/coinz/simappcli/key_seed.json)"
${RELAYER_CMD} keys restore securityz testkey "$(jq -r '.secret' /root/data/cli/securityz/simappcli/key_seed.json)"

# Then its time to initialize the relayer's lite clients for each chain
# All data moving forward is validated by these lite clients.
${RELAYER_CMD} lite init coordinatorz -f
${RELAYER_CMD} lite init coinz -f
${RELAYER_CMD} lite init securityz -f

retry() {
   MAX_RETRY=5
   n=0
   until [ $n -ge $MAX_RETRY ]
   do
      "$@" && break
      n=$[$n+1]
      sleep 1s
   done
   if [ $n -ge $MAX_RETRY ]; then
     echo "failed to execute command ${@}" >&2
     exit 1
   fi
}

# Sometimes an execution of ABCI query is unstable when running on Github action, so we retry it
# Now you can connect the two chains with one command:
retry ${RELAYER_CMD} tx full-path $1 -d -o 3s

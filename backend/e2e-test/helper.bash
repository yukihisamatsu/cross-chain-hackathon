URL=http://localhost:8080/api
CURL="curl -sf -H \"Content-Type: application/json\""

ALICE_ADDR="cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"
BOB_ADDR="cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498"

SAMPLE_CROSS_TX='{"type":"cosmos-sdk/StdTx","value":{"msg":[{"type":"cross/MsgInitiate","value":{"Sender":"cosmos1j42p6wpqwgw8tcyk44vdkyywa0d4qhk2f7kv73","ChainID":"ibc0","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1j42p6wpqwgw8tcyk44vdkyywa0d4qhk2f7kv73"],"contract":"GqH1iNgKBXRyYWluEgdyZXNlcnZlGgQAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"c2VhdC8x","V":"lVQdOCByHHXglq1Y2xCO69tQXso="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1j42p6wpqwgw8tcyk44vdkyywa0d4qhk2f7kv73"],"contract":"GqH1iNgKBWhvdGVsEgdyZXNlcnZlGgQAAAAC","ops":[{"type":"store/lock/Write","value":{"K":"cm9vbS8y","V":"lVQdOCByHHXglq1Y2xCO69tQXso="}}]}],"TimeoutHeight":"149","Nonce":"0"}}],"fee":{"amount":[],"gas":"200000"},"signatures":null,"memo":""}}'

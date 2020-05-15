import {CrossTx} from "~src/libs/api";
import {COORDINATOR_CHAIN_ID, Cosmos} from "~src/libs/cosmos/util";

describe("cosmos lib", () => {
  const alice =
    "vague domain finger zero service door father scheme immense gravity warfare kiwi park glimpse real twist this crunch loud hello throw camera era stool";
  // const bob =
  //   "basic rotate junk scorpion orient enlist inspire tooth eight hunt loyal rain pitch chaos cart brisk fringe program zero blood electric apart lady walnut";

  test("get getPubKeyBase64 from mnemonic phrase", () => {
    const crossTx: CrossTx = JSON.parse(noSigJson);
    const sig = Cosmos.signCrossTx(
      crossTx,
      COORDINATOR_CHAIN_ID,
      "8",
      "0",
      alice
    );

    expect(sig.signature).toEqual(
      "SpZB3QrBPW5E+HSFz+kfOdvb8sxk7dqaOW0pyzH0mQdPbV5JSzdyQEGicaP45U6v6qhwzsGxZsks+LjH2CHf3w=="
    );
  });
});

const noSigJson = `{"type":"cosmos-sdk/StdTx","value":{"msg":[{"type":"cross/MsgInitiate","value":{"Sender":"cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9","ChainID":"coordinatorz","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498"],"contract":"TKH1iNgKA2RjYxIIdHJhbnNmZXIaLWNvc21vczF3OXR1bXh2dnhldnE1Z2FjNXNlMnVxMHM1MHE3eWs5Z3l5dndlORoIAAAAAAAAAAE=","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTg=","V":"AAAAAAAPQj8="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTk=","V":"AAAAAAAPQkE="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"],"contract":"WaH1iNgKBmVzdGF0ZRIIdHJhbnNmZXIaCAAAAAAAAAABGi1jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgaCAAAAAAAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTkvdG9rZW4vMQ==","V":"AAAAAAAAA+Y="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgvdG9rZW4vMQ==","V":"AAAAAAAAAAE="}},{"type":"store/lock/Write","value":{"K":"b3duZXJDb3VudC8x","V":"AAAAAAAAAAM="}},{"type":"store/lock/Read","value":{"K":"Y3JlYXRvci8x"}},{"type":"store/lock/Read","value":{"K":"d2hpdGVsaXN0L2Nvc21vczFsNGdncmV5cHEwZ3I4bjk2ZTcyNDZ0c3k5NXBxcHl1OXpkZDQ5OC9ieS9jb3Ntb3MxeWsweDRwcWN3eXV4dHJzZDhucXoyeDB4ZDN1Y2FmZWQ5NndkMDI="}}]}],"TimeoutHeight":"1051","Nonce":"0"}}],"fee":{"amount":[],"gas":"200000"},"signatures":[{"pub_key":"61rphyEDo1Q6phBwqF0x5eqp8hJyzsCyVpee81V2r1KlP+kTDrQ=","signature":"SpZB3QrBPW5E+HSFz+kfOdvb8sxk7dqaOW0pyzH0mQdPbV5JSzdyQEGicaP45U6v6qhwzsGxZsks+LjH2CHf3w=="}],"memo":""}}`;

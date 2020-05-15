import {decodePubKeySecp256k1} from "@tendermint/amino-js";
import * as secp256k1 from "secp256k1";

import {CrossTx} from "~src/libs/api";
import {
  COORDINATOR_CHAIN_ID,
  Cosmos,
  sortObjectByKey
} from "~src/libs/cosmos/util";

describe("cosmos lib", () => {
  const alice =
    "vague domain finger zero service door father scheme immense gravity warfare kiwi park glimpse real twist this crunch loud hello throw camera era stool";
  // const bob =
  //   "basic rotate junk scorpion orient enlist inspire tooth eight hunt loyal rain pitch chaos cart brisk fringe program zero blood electric apart lady walnut";

  test("encode pubkey", () => {
    const privateKey = Cosmos.getPrivateKey(alice);
    const publicKeyBase64 = Cosmos.getPubKeyBase64(privateKey);
    expect(publicKeyBase64).toEqual(
      "61rphyEDo1Q6phBwqF0x5eqp8hJyzsCyVpee81V2r1KlP+kTDrQ="
    );

    const publicKeyBuf = Cosmos.getPublicKey(privateKey);
    const decoded = decodePubKeySecp256k1(publicKeyBuf, false);
    const decodedJson: {type: string; value: string} = JSON.parse(
      Buffer.from(decoded).toString("utf-8")
    );
    const publicKey = secp256k1.publicKeyCreate(privateKey, true);
    expect(decodedJson.value).toEqual(publicKey.toString("base64"));
  });

  test("get getPubKeyBase64 from mnemonic phrase", () => {
    const crossTx: CrossTx = JSON.parse(noSigJson);
    const sig = Cosmos.signCrossTx({
      crossTx,
      chainId: COORDINATOR_CHAIN_ID,
      accountNumber: "8",
      sequence: "0",
      mnemonic: alice
    });

    expect(sig.signature).toEqual(
      "SpZB3QrBPW5E+HSFz+kfOdvb8sxk7dqaOW0pyzH0mQdPbV5JSzdyQEGicaP45U6v6qhwzsGxZsks+LjH2CHf3w=="
    );
  });

  test("sort SignMessage", () => {
    // expect(JSON.stringify(sortObject(JSON.parse(unSoretdSignMessage)))).toEqual(
    //   sortedSignMessage
    // );
    expect(
      JSON.stringify(sortObjectByKey(JSON.parse(unSoretdSignMessage)))
    ).toEqual(sortedSignMessage);
  });
});

const noSigJson = `{"type":"cosmos-sdk/StdTx","value":{"msg":[{"type":"cross/MsgInitiate","value":{"Sender":"cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9","ChainID":"coordinatorz","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498"],"contract":"TKH1iNgKA2RjYxIIdHJhbnNmZXIaLWNvc21vczF3OXR1bXh2dnhldnE1Z2FjNXNlMnVxMHM1MHE3eWs5Z3l5dndlORoIAAAAAAAAAAE=","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTg=","V":"AAAAAAAPQj8="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTk=","V":"AAAAAAAPQkE="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"],"contract":"WaH1iNgKBmVzdGF0ZRIIdHJhbnNmZXIaCAAAAAAAAAABGi1jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgaCAAAAAAAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTkvdG9rZW4vMQ==","V":"AAAAAAAAA+Y="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgvdG9rZW4vMQ==","V":"AAAAAAAAAAE="}},{"type":"store/lock/Write","value":{"K":"b3duZXJDb3VudC8x","V":"AAAAAAAAAAM="}},{"type":"store/lock/Read","value":{"K":"Y3JlYXRvci8x"}},{"type":"store/lock/Read","value":{"K":"d2hpdGVsaXN0L2Nvc21vczFsNGdncmV5cHEwZ3I4bjk2ZTcyNDZ0c3k5NXBxcHl1OXpkZDQ5OC9ieS9jb3Ntb3MxeWsweDRwcWN3eXV4dHJzZDhucXoyeDB4ZDN1Y2FmZWQ5NndkMDI="}}]}],"TimeoutHeight":"1051","Nonce":"0"}}],"fee":{"amount":[],"gas":"200000"},"signatures":[{"pub_key":"61rphyEDo1Q6phBwqF0x5eqp8hJyzsCyVpee81V2r1KlP+kTDrQ=","signature":"SpZB3QrBPW5E+HSFz+kfOdvb8sxk7dqaOW0pyzH0mQdPbV5JSzdyQEGicaP45U6v6qhwzsGxZsks+LjH2CHf3w=="}],"memo":""}}`;

const unSoretdSignMessage = `{"account_number":"9","chain_id":"coordinatorz","fee":{"amount":[],"gas":"200000"},"memo":"","msgs":[{"type":"cross/MsgInitiate","value":{"Sender":"cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9","ChainID":"coordinatorz","ContractTransactions":[{"source":{"port":"cross","channel":"ibconexfer"},"signers":["cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498"],"contract":"TKH1iNgKA2RjYxIIdHJhbnNmZXIaLWNvc21vczF3OXR1bXh2dnhldnE1Z2FjNXNlMnVxMHM1MHE3eWs5Z3l5dndlORoIAAAAAAAAAAE=","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTg=","V":"AAAAAAAehH4="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTk=","V":"AAAAAAAehII="}}]},{"source":{"port":"cross","channel":"ibctwoxfer"},"signers":["cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"],"contract":"WaH1iNgKBmVzdGF0ZRIIdHJhbnNmZXIaCAAAAAAAAAADGi1jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgaCAAAAAAAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTkvdG9rZW4vMw==","V":"AAAAAAAAAfM="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgvdG9rZW4vMw==","V":"AAAAAAAAAAE="}},{"type":"store/lock/Write","value":{"K":"b3duZXJDb3VudC8z","V":"AAAAAAAAAAI="}},{"type":"store/lock/Read","value":{"K":"Y3JlYXRvci8z"}},{"type":"store/lock/Read","value":{"K":"d2hpdGVsaXN0L2Nvc21vczFsNGdncmV5cHEwZ3I4bjk2ZTcyNDZ0c3k5NXBxcHl1OXpkZDQ5OC9ieS9jb3Ntb3MxeWsweDRwcWN3eXV4dHJzZDhucXoyeDB4ZDN1Y2FmZWQ5NndkMDI="}},{"type":"store/lock/Read","value":{"K":"ZGl2aWRlbmRJbmRleC8z"}}]}],"TimeoutHeight":"3882","Nonce":"1589548225902"}}],"sequence":"1"}`;
const sortedSignMessage = `{"account_number":"9","chain_id":"coordinatorz","fee":{"amount":[],"gas":"200000"},"memo":"","msgs":[{"type":"cross/MsgInitiate","value":{"ChainID":"coordinatorz","ContractTransactions":[{"contract":"TKH1iNgKA2RjYxIIdHJhbnNmZXIaLWNvc21vczF3OXR1bXh2dnhldnE1Z2FjNXNlMnVxMHM1MHE3eWs5Z3l5dndlORoIAAAAAAAAAAE=","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTg=","V":"AAAAAAAehH4="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTk=","V":"AAAAAAAehII="}}],"signers":["cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498"],"source":{"channel":"ibconexfer","port":"cross"}},{"contract":"WaH1iNgKBmVzdGF0ZRIIdHJhbnNmZXIaCAAAAAAAAAADGi1jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgaCAAAAAAAAAAB","ops":[{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3Mxdzl0dW14dnZ4ZXZxNWdhYzVzZTJ1cTBzNTBxN3lrOWd5eXZ3ZTkvdG9rZW4vMw==","V":"AAAAAAAAAfM="}},{"type":"store/lock/Write","value":{"K":"YWNjb3VudC9jb3Ntb3MxbDRnZ3JleXBxMGdyOG45NmU3MjQ2dHN5OTVwcXB5dTl6ZGQ0OTgvdG9rZW4vMw==","V":"AAAAAAAAAAE="}},{"type":"store/lock/Write","value":{"K":"b3duZXJDb3VudC8z","V":"AAAAAAAAAAI="}},{"type":"store/lock/Read","value":{"K":"Y3JlYXRvci8z"}},{"type":"store/lock/Read","value":{"K":"d2hpdGVsaXN0L2Nvc21vczFsNGdncmV5cHEwZ3I4bjk2ZTcyNDZ0c3k5NXBxcHl1OXpkZDQ5OC9ieS9jb3Ntb3MxeWsweDRwcWN3eXV4dHJzZDhucXoyeDB4ZDN1Y2FmZWQ5NndkMDI="}},{"type":"store/lock/Read","value":{"K":"ZGl2aWRlbmRJbmRleC8z"}}],"signers":["cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"],"source":{"channel":"ibctwoxfer","port":"cross"}}],"Nonce":"1589548225902","Sender":"cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9","TimeoutHeight":"3882"}}],"sequence":"1"}`;

import {encodePubKeySecp256k1} from "@tendermint/amino-js";
import bech32 from "bech32";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as crypto from "crypto";
import log from "loglevel";
import * as secp256k1 from "secp256k1";

import {CrossTx, Msg, StdFee, StdSignature} from "~src/libs/api";
import {encodeContractCallInfo} from "~src/libs/cosmos/Amino";
import {ContractCallInfo} from "~src/libs/cosmos/rest-client";
import {Address, Base64EncodedString} from "~src/types";

const path = "m/44'/118'/0'/0/0";
const bech32MainPrefix = "cosmos";

export const COORDINATOR_CHAIN_ID = "coordinatorz";
export const SECURITY_CHAIN_ID = "securityz";

interface SignedMessage<T> {
  account_number: string;
  chain_id: string;
  fee: StdFee;
  memo: string;
  msgs: T[];
  sequence: string;
  signatures?: Array<StdSignature>;
}

type CrossSignedMessage = SignedMessage<Msg>;
type ContractCallSignedMessage = SignedMessage<ContractCallMsg>;

export interface ContractCallStdTx {
  msg: Array<ContractCallMsg>;
  fee: StdFee;
  signatures?: Array<StdSignature>;
  memo: string;
}

export interface ContractCallMsg {
  type: "contract/MsgContractCall";
  value: {
    sender: Address;
    signers: Address[] | null;
    contract: Base64EncodedString;
  };
}

export const Cosmos = {
  getAddress: (mnemonic: string) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(path);
    const words = bech32.toWords(child.identifier);
    return bech32.encode(bech32MainPrefix, words);
  },

  getPrivateKey: (mnemonic: string): Buffer => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(path);
    if (!child.privateKey) {
      throw new Error("could not derive private key");
    }
    return child.privateKey;
  },

  getPublicKey: (privateKey: Buffer): Buffer => {
    const publicKey = secp256k1.publicKeyCreate(privateKey, true);
    const json = JSON.stringify({
      type: "tendermint/PubKeySecp256k1",
      value: publicKey.toString("base64")
    });
    return Buffer.from(
      encodePubKeySecp256k1(Buffer.from(json, "utf-8"), false)
    );
  },

  getPubKeyBase64: (privateKey: Buffer): string => {
    return Cosmos.getPublicKey(privateKey).toString("base64");
  },

  createContractCallInfoBase64: (
    value: ContractCallInfo
  ): Base64EncodedString => {
    const buf = Buffer.from(
      JSON.stringify({
        type: "contract/ContractCallInfo",
        value
      }),
      "utf8"
    );

    const contractBuf = encodeContractCallInfo(buf, true);
    return Buffer.from(contractBuf).toString("base64");
  },

  signCrossTx: ({
    crossTx,
    accountNumber: account_number,
    sequence,
    mnemonic
  }: {
    crossTx: CrossTx;
    accountNumber: string;
    sequence: string;
    mnemonic: string;
  }) => {
    const {
      value: {msg: msgs, fee, memo}
    } = crossTx;

    const signedMessage: CrossSignedMessage = {
      account_number,
      chain_id: COORDINATOR_CHAIN_ID,
      fee,
      memo,
      msgs,
      sequence
    };

    const privateKey = Cosmos.getPrivateKey(mnemonic);
    return signTx(
      (signedMessage as unknown) as JSONValueTypeObject,
      privateKey
    );
  },

  signContractCallTx: ({
    contractCallTxs: msgs,
    chainId: chain_id,
    accountNumber: account_number,
    sequence,
    fee,
    memo,
    mnemonic
  }: {
    contractCallTxs: ContractCallMsg[];
    chainId: string;
    accountNumber?: string;
    sequence: string;
    fee: StdFee;
    memo: string;
    mnemonic: string;
  }) => {
    const signedMessage: ContractCallSignedMessage = {
      account_number: account_number ?? "0",
      chain_id,
      fee,
      memo,
      msgs,
      sequence
    };

    const privateKey = Cosmos.getPrivateKey(mnemonic);
    return signTx(
      (signedMessage as unknown) as JSONValueTypeObject,
      privateKey
    );
  }
} as const;

const signTx = (msg: JSONValueTypeObject, privateKey: Buffer) => {
  const sortedSignedMessage = JSON.stringify(sortObjectByKey(msg));
  log.debug("sortedSignedMessage", sortedSignedMessage);

  const hash = crypto
    .createHash("sha256")
    .update(sortedSignedMessage)
    .digest("hex");
  const buf = Buffer.from(hash, "hex");

  const signObj = secp256k1.sign(buf, privateKey);
  const signatureBase64 = signObj.signature.toString("base64");

  return {
    pub_key: Cosmos.getPubKeyBase64(privateKey),
    signature: signatureBase64
  };
};

type JSONValueType =
  | string
  | number
  | boolean
  | JSONValueTypeObject
  | JSONValueTypeArray
  | Function
  | null;

type JSONValueTypeArray = Array<JSONValueType>;
interface JSONValueTypeObject {
  [key: string]: JSONValueType;
}

export const sortObjectByKey = (jsonValue: JSONValueTypeObject) => {
  function evil(fn: string) {
    return new Function("return " + fn)();
  }

  const sort = (jsonValue: JSONValueTypeObject): JSONValueTypeObject => {
    const tmp: JSONValueTypeObject = {};
    Object.keys(jsonValue)
      .sort()
      .forEach(k => {
        const v = jsonValue[k];
        if (isArray(v)) {
          const p: JSONValueTypeArray = [];
          v.forEach((item: JSONValueType) => {
            if (item != null && isObject(item)) {
              p.push(sort(item));
            } else {
              p.push(item);
            }
          });
          tmp[k] = p;
        } else if (v != null && isObject(v)) {
          tmp[k] = sort(v);
        } else if (v != null && isFunction(v)) {
          tmp[k] = evil(v.toString());
        } else if (v === null) {
          tmp[k] = null;
        } else {
          tmp[k] = String(v).toString();
        }
      });
    return tmp;
  };
  return sort(jsonValue);
};

const isArray = (a: JSONValueType): a is JSONValueTypeArray => Array.isArray(a);
const isObject = (a: JSONValueType): a is JSONValueTypeObject =>
  typeof a === "object";
const isFunction = (a: JSONValueType): a is Function => typeof a === "function";

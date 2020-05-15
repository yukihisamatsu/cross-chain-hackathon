import {encodePubKeySecp256k1} from "@tendermint/amino-js";
import bech32 from "bech32";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as crypto from "crypto";
import log from "loglevel";
import * as secp256k1 from "secp256k1";

import {
  ChannelInfo,
  CrossTx,
  Msg,
  Op,
  OpValue,
  StdSignature
} from "~src/libs/api";

const path = "m/44'/118'/0'/0/0";
const bech32MainPrefix = "cosmos";

export const COORDINATOR_CHAIN_ID = "coordinatorz";

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

  signCrossTx: (
    crossTx: CrossTx,
    chainId: string,
    accountNumber: string,
    sequence: string,
    mnemonic: string
  ) => {
    const {
      value: {msg, fee, memo}
    } = crossTx;

    const signedMessage: CrossSignedMessage = {
      account_number: accountNumber,
      chain_id: chainId,
      fee: {...fee},
      memo: memo,
      msgs: msg,
      sequence: sequence
    };

    const sortedSignedMessage = JSON.stringify(sortObject(signedMessage));
    log.debug("sortedSignedMessage", sortedSignedMessage);

    const hash = crypto
      .createHash("sha256")
      .update(sortedSignedMessage)
      .digest("hex");
    const buf = Buffer.from(hash, "hex");

    const privateKey = Cosmos.getPrivateKey(mnemonic);
    const signObj = secp256k1.sign(buf, privateKey);
    const signatureBase64 = signObj.signature.toString("base64");

    return {
      pub_key: Cosmos.getPubKeyBase64(privateKey),
      signature: signatureBase64
    };
  }
} as const;

const sortObject = ({
  account_number,
  chain_id,
  fee: {amount, gas},
  memo,
  msgs,
  sequence,
  signatures
}: CrossSignedMessage): CrossSignedMessage => {
  return {
    account_number,
    chain_id,
    fee: {
      amount,
      gas
    },
    memo: memo,
    msgs: msgs.map(
      ({
        type,
        value: {ChainID, ContractTransactions, Nonce, Sender, TimeoutHeight}
      }: Msg) => {
        return {
          type,
          value: {
            ChainID,
            ContractTransactions: ContractTransactions.map(
              ({contract, ops, signers, source: {channel, port}}) => {
                return {
                  contract,
                  ops,
                  signers,
                  source: {
                    channel,
                    port
                  }
                };
              }
            ),
            Nonce,
            Sender,
            TimeoutHeight
          }
        };
      }
    ),
    sequence,
    signatures:
      signatures &&
      signatures.map(({pub_key, signature}) => {
        return {pub_key, signature};
      })
  };
};

export interface CrossSignedMessage {
  account_number: string;
  chain_id: string;
  fee: CrossStdTxFee;
  memo: string;
  msgs: Array<CrossStdMsg>;
  sequence: string;
  signatures?: Array<StdSignature>;
}

export interface CrossStdTxFee {
  amount: Array<CrossStdCoin>;
  gas: string;
}

export interface CrossStdCoin {
  amount: number;
  denom?: string;
}

export interface CrossStdMsg {
  value: CrossStdMsgInitiate;
  type: string;
}

export interface CrossStdMsgInitiate {
  ChainID: string;
  ContractTransactions: Array<CrossStdMsgContractTransaction>;
  Nonce: string;
  Sender: string;
  TimeoutHeight: string;
}

export interface CrossStdMsgContractTransaction {
  contract: string;
  ops: Array<CrossStdMsgOp>;
  signers: Array<string>;
  source: CrossStdMsgChannelInfo;
}

export interface CrossStdMsgOp extends Op {
  type: string;
  value: CrossStdMsgOpValue;
}

export interface CrossStdMsgOpValue extends OpValue {
  K: string;
  V?: string;
}

export interface CrossStdMsgChannelInfo extends ChannelInfo {
  channel: string;
  port: string;
}

import bech32 from "bech32";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as bitcoinjs from "bitcoinjs-lib";
import * as crypto from "crypto";
import * as secp256k1 from "secp256k1";

const path = "m/44'/118'/0'/0/0";
const bech32MainPrefix = "cosmos";

export const getAddress = (mnemonic: string) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  const words = bech32.toWords(child.identifier);
  return bech32.encode(bech32MainPrefix, words);
};

export const getECPairPriv = (mnemonic: string): Buffer => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  const child = node.derivePath(path);
  if (!child.privateKey) {
    throw new Error("could not derive private key");
  }
  const ecPair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, {
    compressed: false
  });

  if (!ecPair.privateKey) {
    throw new Error("could not create ec pair");
  }
  return ecPair.privateKey;
};

export const getPubKeyBase64 = (ecPairPriv: Buffer): string => {
  const pubKeyByte = secp256k1.publicKeyCreate(ecPairPriv);
  return Buffer.from(pubKeyByte).toString("base64");
};

type SignedMsgType = {[key: string]: string | number | object};

export const newStdMsg = (
  input: SignedMsgType
): {json: SignedMsgType; bytes: Buffer} => {
  return {
    json: input,
    bytes: Buffer.from(JSON.stringify(sortObject(input)), "utf8")
  };
};

export const sign = (
  stdSignMsg: {json: SignedMsgType; bytes: Buffer},
  ecPairPriv: Buffer,
  modeType = "sync"
) => {
  // The supported return types includes "block"(return after tx commit), "sync"(return after CheckTx) and "async"(return right away).
  const signMessage = stdSignMsg.json;
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(sortObject(signMessage)))
    .digest("hex");

  const buf = Buffer.from(hash, "hex");
  const signObj = secp256k1.sign(buf, ecPairPriv);
  const signatureBase64 = signObj.signature.toString("base64");
  return {
    tx: {
      msg: stdSignMsg.json.msgs,
      fee: stdSignMsg.json.fee,
      signatures: [
        {
          signature: signatureBase64,
          pub_key: {
            type: "tendermint/PubKeySecp256k1",
            value: getPubKeyBase64(ecPairPriv)
          }
        }
      ],
      memo: stdSignMsg.json.memo
    },
    mode: modeType
  };
};

const sortObject = (msg: SignedMsgType): SignedMsgType => {
  const sortKeys: (keyof SignedMsgType)[] = Object.keys(msg).sort();
  return sortKeys.reduce<SignedMsgType>(
    (acc: SignedMsgType, currentKey: keyof SignedMsgType) => {
      acc[currentKey] = msg[currentKey];
      return acc;
    },
    {}
  );
};

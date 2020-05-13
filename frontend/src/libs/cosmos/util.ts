import bech32 from "bech32";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as bitcoinjs from "bitcoinjs-lib";
import * as crypto from "crypto";
import * as secp256k1 from "secp256k1";

import {StdTx} from "~src/libs/api";

const path = "m/44'/118'/0'/0/0";
const bech32MainPrefix = "cosmos";

export const Cosmos = {
  getAddress: (mnemonic: string) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const child = node.derivePath(path);
    const words = bech32.toWords(child.identifier);
    return bech32.encode(bech32MainPrefix, words);
  },

  getECPairPriv: (mnemonic: string): Buffer => {
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
  },

  getPubKeyBase64: (ecPairPriv: Buffer): string => {
    const pubKeyByte = secp256k1.publicKeyCreate(ecPairPriv);
    return Buffer.from(pubKeyByte).toString("base64");
  },

  signCrossTx: (stdTx: StdTx, ecPairPriv: Buffer) => {
    const signedStdTx: StdTx = {
      ...stdTx
    };

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(signedStdTx))
      .digest("hex");

    const buf = Buffer.from(hash, "hex");
    const signObj = secp256k1.sign(buf, ecPairPriv);
    const signatureBase64 = signObj.signature.toString("base64");

    const sig = {
      pub_key: Cosmos.getPubKeyBase64(ecPairPriv),
      signature: signatureBase64
    };

    const sigs = Array.isArray(signedStdTx.signatures)
      ? signedStdTx.signatures
      : [];

    sigs.push(sig);
    signedStdTx.signatures = sigs;

    return signedStdTx;
  }
} as const;

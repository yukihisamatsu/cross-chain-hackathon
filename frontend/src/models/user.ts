import {Address} from "~src/types";

export class User {
  id: string;
  name: string;
  address: Address;
  mnemonic: string;
  balance: number;
  isWhitelisted: boolean;

  constructor({
    id,
    name,
    address,
    mnemonic,
    balance,
    isWhitelisted
  }: {
    id: string;
    name: string;
    address: Address;
    mnemonic: string;
    balance: number;
    isWhitelisted: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.mnemonic = mnemonic;
    this.balance = balance;
    this.isWhitelisted = isWhitelisted;
  }

  static create(jsonStr: string) {
    const json: User = JSON.parse(jsonStr);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return new User({
      id: json["id"],
      name: json["name"],
      address: json["address"],
      mnemonic: json["mnemonic"],
      balance: 0,
      isWhitelisted: false
    });
  }

  static default() {
    return new User({
      id: "",
      name: "",
      address: "",
      mnemonic: "",
      balance: 0,
      isWhitelisted: false
    });
  }
}

import {Address} from "~src/types";

export class User {
  id: string;
  name: string;
  address: Address;
  mnemonic: string;

  constructor({
    id,
    name,
    address,
    mnemonic
  }: {
    id: string;
    name: string;
    address: Address;
    mnemonic: string;
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.mnemonic = mnemonic;
  }

  static create(jsonStr: string) {
    const json: User = JSON.parse(jsonStr);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return new User({
      id: json["id"],
      name: json["name"],
      address: json["address"],
      mnemonic: json["mnemonic"]
    });
  }

  static default() {
    return new User({
      id: "",
      name: "",
      address: "",
      mnemonic: ""
    });
  }
}

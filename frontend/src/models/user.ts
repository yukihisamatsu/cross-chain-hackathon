import {Address} from "~src/types";

export class User {
  id: string;
  name: string;
  address: Address;
  privateKey: Buffer;

  constructor({
    id,
    name,
    address,
    privateKey
  }: {
    id: string;
    name: string;
    address: Address;
    privateKey: Buffer;
  }) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.privateKey = privateKey;
  }
}

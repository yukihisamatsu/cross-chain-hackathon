import {Unbox} from "~src/heplers/util-types";
import {Address} from "~src/types";

export const DIVIDEND_HISTORY_STATUS = {
  REGISTERED: "registered",
  ONGOING: "ongoing",
  DISTRIBUTED: "distributed"
} as const;
export type DividendHistoryStatusType = Unbox<typeof DIVIDEND_HISTORY_STATUS>;
export class DividendHistory {
  index: number;
  height: number;
  total: number;
  status: DividendHistoryStatusType;

  constructor({
    index,
    height,
    total,
    status
  }: {
    index: number;
    height: number;
    total: number;
    status: DividendHistoryStatusType;
  }) {
    this.index = index;
    this.height = height;
    this.total = total;
    this.status = status;
  }

  static default = (): DividendHistory => {
    return new DividendHistory({
      index: 0,
      height: 0,
      total: 0,
      status: DIVIDEND_HISTORY_STATUS.REGISTERED
    });
  };
}

export class DividendOwner {
  name: string;
  address: Address;
  balance: number;

  constructor({
    name,
    address,
    balance
  }: {
    name: Address;
    address: string;
    balance: number;
  }) {
    this.name = name;
    this.address = address;
    this.balance = balance;
  }
}

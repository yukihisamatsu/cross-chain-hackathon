import {Unbox} from "~src/heplers/util-types";
import {Address} from "~src/types";

export const DIVIDEND_HISTORY_STATUS = {
  REGISTERED: "registered",
  ONGOING: "ongoing",
  DISTRIBUTED: "distributed"
} as const;
export type DividendHistoryStatusType = Unbox<typeof DIVIDEND_HISTORY_STATUS>;
export type PaidOnlyDividendHistory = Pick<
  DividendHistory,
  "distributedHeight" | "distributedTimeStamp" | "distributedTxHash" | "status"
>;

export class DividendHistory {
  index: number;
  registeredHeight: number;
  registeredTimeStamp: string;
  registeredTxHash: string;
  distributedHeight?: number;
  distributedTimeStamp?: string;
  distributedTxHash?: string;
  perUnit: number;
  total: number;
  status: DividendHistoryStatusType;

  constructor({
    index,
    registeredHeight,
    registeredTimeStamp,
    registeredTxHash,
    distributedHeight,
    distributedTimeStamp,
    distributedTxHash,
    perUnit,
    total,
    status
  }: {
    index: number;
    registeredHeight: number;
    registeredTimeStamp: string;
    registeredTxHash: string;
    distributedHeight?: number;
    distributedTimeStamp?: string;
    distributedTxHash?: string;
    perUnit: number;
    total: number;
    status: DividendHistoryStatusType;
  }) {
    this.index = index;
    this.registeredHeight = registeredHeight;
    this.registeredTimeStamp = registeredTimeStamp;
    this.registeredTxHash = registeredTxHash;
    this.distributedHeight = distributedHeight;
    this.distributedTimeStamp = distributedTimeStamp;
    this.distributedTxHash = distributedTxHash;
    this.perUnit = perUnit;
    this.total = total;
    this.status = status;
  }

  static default = (): DividendHistory => {
    return new DividendHistory({
      index: 0,
      registeredHeight: 0,
      registeredTimeStamp: "",
      registeredTxHash: "",
      distributedHeight: undefined,
      distributedTimeStamp: undefined,
      distributedTxHash: undefined,
      perUnit: 0,
      total: 0,
      status: DIVIDEND_HISTORY_STATUS.REGISTERED
    });
  };

  merge(paidHistory: PaidOnlyDividendHistory): DividendHistory {
    return {
      ...this,
      ...paidHistory
    };
  }

  isRegistering(): boolean {
    return (
      this.status === DIVIDEND_HISTORY_STATUS.REGISTERED ||
      this.status === DIVIDEND_HISTORY_STATUS.ONGOING
    );
  }

  isDistributed(): boolean {
    return this.status === DIVIDEND_HISTORY_STATUS.DISTRIBUTED;
  }
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

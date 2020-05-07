import {Address} from "~pages/types";
import {Unbox} from "~src/heplers/util-types";

export const USER_DIVIDEND_STATUS = {
  RECEIVED: "received",
  NOT_RECEIVED: "not_received"
} as const;
export type UserDividendStatusType = Unbox<typeof USER_DIVIDEND_STATUS>;
export class UserDividend {
  dividendDate: string;
  totalAmount: number;
  status: UserDividendStatusType;

  constructor({
    dividendDate,
    totalAmount,
    status
  }: {
    dividendDate: string;
    totalAmount: number;
    status: UserDividendStatusType;
  }) {
    this.dividendDate = dividendDate;
    this.totalAmount = totalAmount;
    this.status = status;
  }
}

export class IssuerDividend {
  userName: string;
  userAddress: Address;
  purchaseDate: string;

  constructor({
    userName,
    userAddress,
    purchaseDate
  }: {
    userName: string;
    userAddress: Address;
    purchaseDate: string;
  }) {
    this.userName = userName;
    this.userAddress = userAddress;
    this.purchaseDate = purchaseDate;
  }
}

export const ISSUER_DIVIDEND_HISTORY_STATUS = {
  NOT_DISTRIBUTED: "not_distributed",
  ONGOING: "ongoing",
  DISTRIBUTED: "distributed"
} as const;
export type IssuerDividendHistoryStatusType = Unbox<
  typeof ISSUER_DIVIDEND_HISTORY_STATUS
>;
export class IssuerDividendHistory {
  id: string;
  dividendDate: Address;
  total: number;
  status: IssuerDividendHistoryStatusType;

  constructor({
    id,
    dividendDate,
    total,
    status
  }: {
    id: string;
    dividendDate: string;
    total: number;
    status: IssuerDividendHistoryStatusType;
  }) {
    this.id = id;
    this.dividendDate = dividendDate;
    this.total = total;
    this.status = status;
  }

  static default = (): IssuerDividendHistory => {
    return new IssuerDividendHistory({
      id: "",
      dividendDate: "",
      total: 0,
      status: ISSUER_DIVIDEND_HISTORY_STATUS.NOT_DISTRIBUTED
    });
  };
}

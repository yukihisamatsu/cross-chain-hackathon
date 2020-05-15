import {Unbox} from "~src/heplers/util-types";
import {Address} from "~src/types";

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
export class DividendHistory {
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

  static default = (): DividendHistory => {
    return new DividendHistory({
      id: "",
      dividendDate: "",
      total: 0,
      status: ISSUER_DIVIDEND_HISTORY_STATUS.NOT_DISTRIBUTED
    });
  };
}

export class DividendOwner {
  owner: Address;
  balance: number;
}

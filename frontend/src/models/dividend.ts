import {Unbox} from "~src/heplers/util-types";

export const DIVIDEND_STATUS = {
  RECEIVED: "received",
  NOT_RECEIVED: "not_received"
} as const;
export type DividendStatusType = Unbox<typeof DIVIDEND_STATUS>;

export class Dividend {
  dividendDate: string;
  totalAmount: number;
  status: DividendStatusType;

  constructor({
    dividendDate,
    totalAmount,
    status
  }: {
    dividendDate: string;
    totalAmount: number;
    status: DividendStatusType;
  }) {
    this.dividendDate = dividendDate;
    this.totalAmount = totalAmount;
    this.status = status;
  }
}

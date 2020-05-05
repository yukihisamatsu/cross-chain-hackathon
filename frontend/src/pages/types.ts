import {Unbox} from "~src/heplers/util-types";

export interface Estate {
  tokenId: string;
  name: string;
  imagePath: string;
  description: string;
  expectedYieldRatio: string;
  dividendDate: string;
  issuedBy?: string;
  units?: number;
  status?: string;
  dividend: Dividend[];
  sellOrder: SellEstateOrder[];
}

export const DIVIDEND_STATUS = {
  RECEIVED: "received",
  NOT_RECEIVED: "not_received"
} as const;
export type DividendStatusType = Unbox<typeof DIVIDEND_STATUS>;
export interface Dividend {
  dividendDate: string;
  totalAmount: number;
  status: DividendStatusType;
}

export const OWNED_ESTATE_STATUS = {
  SELLING: "selling",
  BUYING: "buying"
} as const;
export type OwnedEstateStatusType = Unbox<typeof OWNED_ESTATE_STATUS>;
export interface OwnedEstate extends Estate {
  issuedBy: string;
  units: number;
  status: OwnedEstateStatusType;
}

export const SELL_ESTATE_ORDER_STATUS = {
  OFFERING: "offering",
  RESPONDING: "responding",
  ONGOING: "ongoing"
} as const;
export type SellEstateOrderStatusType = Unbox<typeof SELL_ESTATE_ORDER_STATUS>;
export interface SellEstateOrder {
  tokenId: string;
  offerer: string;
  quantity: number;
  perUnitPrice: number;
  total: number;
  status: SellEstateOrderStatusType;
}

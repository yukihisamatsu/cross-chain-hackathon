import {
  DIVIDEND_STATUS,
  OWNED_ESTATE_STATUS,
  SELL_ESTATE_ORDER_STATUS
} from "~pages/types";

export const DENOM = "DCC";

export const OwnedEstateStatusTagColorMap: {[key: string]: string} = {
  [OWNED_ESTATE_STATUS.SELLING]: "red",
  [OWNED_ESTATE_STATUS.BUYING]: "blue"
};

export const DividendStatusTagColorMap: {[key: string]: string} = {
  [DIVIDEND_STATUS.NOT_RECEIVED]: "orange",
  [DIVIDEND_STATUS.RECEIVED]: "blue"
};

export const SellEstateOrderStatusTagColorMap: {[key: string]: string} = {
  [SELL_ESTATE_ORDER_STATUS.OFFERING]: "orange",
  [SELL_ESTATE_ORDER_STATUS.ONGOING]: "cyan",
  [SELL_ESTATE_ORDER_STATUS.RESPONDING]: "blue"
};

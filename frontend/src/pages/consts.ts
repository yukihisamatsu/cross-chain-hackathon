import {DIVIDEND_HISTORY_STATUS} from "~models/dividend";
import {ESTATE_STATUS} from "~models/estate";
import {OFFER_STATUS, ORDER_STATUS} from "~models/order";

export const LocalStorageUserKey = "USER";

export const OwnedEstateStatusTagColorMap: {
  [ESTATE_STATUS.OWNED]: string;
  [ESTATE_STATUS.SELLING]: string;
  [ESTATE_STATUS.BUYING]: string;
} = {
  [ESTATE_STATUS.OWNED]: "green",
  [ESTATE_STATUS.SELLING]: "red",
  [ESTATE_STATUS.BUYING]: "blue"
};

export const IssueDividendStatusTagColorMap: {[key: string]: string} = {
  [DIVIDEND_HISTORY_STATUS.REGISTERED]: "orange",
  [DIVIDEND_HISTORY_STATUS.ONGOING]: "blue",
  [DIVIDEND_HISTORY_STATUS.DISTRIBUTED]: "green"
};

export const OrderStatusTagColorMap: {[key: string]: string} = {
  [ORDER_STATUS.OPENED]: "blue",
  [ORDER_STATUS.COMPLETED]: "green",
  [ORDER_STATUS.CANCELED]: "orange",
  [ORDER_STATUS.FAILED]: "red"
};

export const OfferStatusTagColorMap: {[key: string]: string} = {
  [OFFER_STATUS.OPENED]: "blue",
  [OFFER_STATUS.ONGOING]: "cyan",
  [OFFER_STATUS.COMPLETED]: "green",
  [OFFER_STATUS.CANCELED]: "orange",
  [OFFER_STATUS.FAILED]: "red"
};

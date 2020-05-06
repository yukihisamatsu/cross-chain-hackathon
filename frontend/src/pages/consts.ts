import {DIVIDEND_STATUS} from "~models/dividend";
import {ESTATE_STATUS} from "~models/estate";
import {ORDER_STATUS} from "~models/order";

export const OwnedEstateStatusTagColorMap: {
  [ESTATE_STATUS.OWNED]: string;
  [ESTATE_STATUS.SELLING]: string;
  [ESTATE_STATUS.BUYING]: string;
} = {
  [ESTATE_STATUS.OWNED]: "green",
  [ESTATE_STATUS.SELLING]: "red",
  [ESTATE_STATUS.BUYING]: "blue"
};

export const DividendStatusTagColorMap: {[key: string]: string} = {
  [DIVIDEND_STATUS.NOT_RECEIVED]: "orange",
  [DIVIDEND_STATUS.RECEIVED]: "blue"
};

export const OrderStatusTagColorMap: {[key: string]: string} = {
  [ORDER_STATUS.REQUESTING]: "orange",
  [ORDER_STATUS.ONGOING]: "blue",
  [ORDER_STATUS.SUCCEEDED]: "green",
  [ORDER_STATUS.FAILED]: "red"
};

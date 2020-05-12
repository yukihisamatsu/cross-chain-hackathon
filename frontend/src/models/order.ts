import BN from "bn.js";

import {Unbox} from "~src/heplers/util-types";
import {Trade, TradeStatus, TradeType} from "~src/libs/api";
import {Address} from "~src/types";

export const ORDER_STATUS = {
  OPENED: "opened",
  CANCELED: "canceled",
  COMPLETED: "completed",
  FAILED: "failed"
} as const;
export type OrderStatusType = Unbox<typeof ORDER_STATUS>;

export class Order {
  tradeId: number;
  tokenId: string;
  quantity: number;
  perUnitPrice: number;
  status: OrderStatusType;
  updatedAt: string;

  constructor({
    tradeId,
    tokenId,
    quantity,
    perUnitPrice,
    status
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    status: OrderStatusType;
  }) {
    this.tradeId = tradeId;
    this.tokenId = tokenId;
    this.quantity = quantity;
    this.perUnitPrice = perUnitPrice;
    this.status = status;
  }

  getTotal(): number {
    return new BN(this.quantity).muln(this.perUnitPrice).toNumber();
  }

  static getStatus(tradeStatus: TradeStatus) {
    switch (tradeStatus) {
      case TradeStatus.TRADE_OPENED:
        return ORDER_STATUS.OPENED;
      case TradeStatus.TRADE_CANCELED:
        return ORDER_STATUS.CANCELED;
      case TradeStatus.TRADE_COMPLETED:
        return ORDER_STATUS.COMPLETED;
    }
  }
}

export class SellOrder extends Order {
  owner: Address;
  buyOffers: BuyOrder[];

  constructor({
    tradeId,
    tokenId,
    quantity,
    perUnitPrice,
    status,
    owner,
    buyOffers,
    updatedAt
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    status: OrderStatusType;
    owner: Address;
    buyOffers: BuyOrder[];
    updatedAt: string;
  }) {
    super({
      tradeId,
      tokenId,
      quantity,
      perUnitPrice,
      status
    });
    this.owner = owner;
    this.buyOffers = buyOffers;
    this.updatedAt = updatedAt;
  }

  toTrade(status: TradeStatus): Trade {
    return {
      id: this.tradeId,
      estateId: this.tokenId,
      seller: this.owner,
      buyer: undefined,
      amount: this.quantity,
      unitPrice: this.perUnitPrice,
      requests: [],
      status: status,
      updatedAt: this.updatedAt,
      type: TradeType.SELL
    };
  }
}

export class BuyOrder extends Order {
  offerer: Address;
  sellOffers: SellOrder[];

  constructor({
    tradeId,
    tokenId,
    quantity,
    perUnitPrice,
    status,
    offerer,
    sellOffers
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    status: OrderStatusType;
    offerer: Address;
    sellOffers: SellOrder[];
  }) {
    super({
      tradeId,
      tokenId,
      quantity,
      perUnitPrice,
      status
    });
    this.offerer = offerer;
    this.sellOffers = sellOffers;
  }
}

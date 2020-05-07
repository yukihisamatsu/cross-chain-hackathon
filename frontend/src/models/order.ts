import {Address} from "~pages/types";
import {Unbox} from "~src/heplers/util-types";

export const ORDER_STATUS = {
  REQUESTING: "requesting",
  ONGOING: "ongoing",
  SUCCEEDED: "succeeded",
  FAILED: "failed"
} as const;
export type OrderStatusType = Unbox<typeof ORDER_STATUS>;

export class Order {
  tradeId: number;
  tokenId: string;
  quantity: number;
  perUnitPrice: number;
  total: number;
  status: OrderStatusType;

  constructor({
    tradeId,
    tokenId,
    quantity,
    perUnitPrice,
    total,
    status
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    total: number;
    status: OrderStatusType;
  }) {
    this.tradeId = tradeId;
    this.tokenId = tokenId;
    this.quantity = quantity;
    this.perUnitPrice = perUnitPrice;
    this.total = total;
    this.status = status;
  }

  isFinished = () => {
    return (
      this.status === ORDER_STATUS.SUCCEEDED ||
      this.status === ORDER_STATUS.FAILED
    );
  };
}

export class SellOrder extends Order {
  owner: Address;
  buyOffers: BuyOrder[];

  constructor({
    tradeId,
    tokenId,
    quantity,
    perUnitPrice,
    total,
    status,
    owner,
    buyOffers
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    total: number;
    status: OrderStatusType;
    owner: Address;
    buyOffers: BuyOrder[];
  }) {
    super({
      tradeId,
      tokenId,
      quantity,
      perUnitPrice,
      total,
      status
    });
    this.owner = owner;
    this.buyOffers = buyOffers;
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
    total,
    status,
    offerer,
    sellOffers
  }: {
    tradeId: number;
    tokenId: string;
    quantity: number;
    perUnitPrice: number;
    total: number;
    status: OrderStatusType;
    offerer: Address;
    sellOffers: SellOrder[];
  }) {
    super({
      tradeId,
      tokenId,
      quantity,
      perUnitPrice,
      total,
      status
    });
    this.offerer = offerer;
    this.sellOffers = sellOffers;
  }
}

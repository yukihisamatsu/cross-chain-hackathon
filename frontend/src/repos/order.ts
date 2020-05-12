import {DateTime} from "luxon";

import {SellOrder} from "~models/order";
import {TradeApi, TradeStatus, TradeType} from "~src/libs/api";
import {BaseRepo} from "~src/repos/base";
import {Address} from "~src/types";

export class OrderRepository extends BaseRepo {
  tradeApi: TradeApi;

  constructor({tradeApi}: {tradeApi: TradeApi}) {
    super();
    this.tradeApi = tradeApi;
  }

  static create({tradeApi}: {tradeApi: TradeApi}): OrderRepository {
    return new OrderRepository({
      tradeApi
    });
  }

  postSellOrder = async (
    tokenId: string,
    amount: number,
    perUnit: number,
    seller: Address
  ) => {
    await this.apiRequest(() =>
      this.tradeApi.postTrade({
        estateId: tokenId,
        unitPrice: perUnit,
        amount,
        seller,
        type: TradeType.SELL,
        id: 0,
        status: TradeStatus.TRADE_OPENED,
        updatedAt: DateTime.utc().toISO(),
        requests: []
      })
    );
  };

  cancelSellOrder = async (sellOrder: SellOrder) => {
    await this.apiRequest(() => {
      const trade = sellOrder.toTrade(TradeStatus.TRADE_CANCELED);
      return this.tradeApi.putTrade(trade);
    });
  };
}

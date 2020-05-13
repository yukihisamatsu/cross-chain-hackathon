import {DateTime} from "luxon";

import {SellOrder} from "~models/order";
import {
  CrossTx,
  TradeApi,
  TradeRequest,
  TradeStatus,
  TradeType,
  TxApi
} from "~src/libs/api";
import {RestClient} from "~src/libs/cosmos/rest-client";
import {BaseRepo} from "~src/repos/base";
import {Address} from "~src/types";

export class OrderRepository extends BaseRepo {
  tradeApi: TradeApi;
  txApi: TxApi;
  coordinatorRestClient: RestClient;

  constructor({
    tradeApi,
    txApi,
    coordinatorRestClient
  }: {
    tradeApi: TradeApi;
    txApi: TxApi;
    coordinatorRestClient: RestClient;
  }) {
    super();
    this.tradeApi = tradeApi;
    this.txApi = txApi;
    this.coordinatorRestClient = coordinatorRestClient;
  }

  static create({
    tradeApi,
    txApi,
    coordinatorRestClient
  }: {
    tradeApi: TradeApi;
    txApi: TxApi;
    coordinatorRestClient: RestClient;
  }): OrderRepository {
    return new OrderRepository({
      tradeApi,
      txApi,
      coordinatorRestClient
    });
  }

  postSellOrder = async (
    tokenId: string,
    amount: number,
    perUnit: number,
    seller: Address
  ) => {
    return await this.apiRequest(() =>
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
    return await this.apiRequest(() => {
      const trade = sellOrder.toTrade(TradeStatus.TRADE_CANCELED);
      return this.tradeApi.putTrade(trade);
    });
  };

  getBuyRequest = async (
    sellOrder: SellOrder,
    from: Address
  ): Promise<CrossTx> => {
    return await this.apiRequest(() => {
      return this.txApi.txTradeRequestGet(sellOrder.tradeId, from);
    });
  };

  postBuyRequest = async (
    sellOrder: SellOrder,
    from: string,
    crossTx: CrossTx
  ): Promise<TradeRequest> => {
    return await this.apiRequest(() => {
      return this.tradeApi.postTradeRequest({
        tradeId: sellOrder.tradeId,
        from,
        crossTx
      });
    });
  };
}

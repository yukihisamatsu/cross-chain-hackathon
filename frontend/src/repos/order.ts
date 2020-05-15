import {DateTime} from "luxon";

import {BuyOffer, SellOrder} from "~models/order";
import {
  CrossTx,
  StdTx,
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
      return this.tradeApi.deleteTrade(sellOrder.tradeId);
    });
  };

  cancelBuyOffer = async (offer: BuyOffer) => {
    return await this.apiRequest(() => {
      return this.tradeApi.deleteTradeRequest(offer.offerId);
    });
  };

  getBuyRequestTx = async (
    sellOrder: SellOrder,
    from: Address
  ): Promise<CrossTx> => {
    return await this.apiRequest(() => {
      return this.txApi.getTxTradeRequest(sellOrder.tradeId, from);
    });
  };

  postBuyOffer = async (
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

  broadcastTx = async (
    stdTx: StdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    const response = await this.coordinatorRestClient.txsPost({
      tx: stdTx,
      mode
    });
    if (response.error || response.code || response.codespace) {
      throw new Error(JSON.stringify(response));
    }
    return response;
  };
}

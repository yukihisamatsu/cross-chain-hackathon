import {DateTime} from "luxon";

import {BuyOffer, SellOrder} from "~models/order";
import {
  CrossTx,
  StdTx,
  TradeApi,
  TradeRequest,
  TradeRequestStatus,
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

  cancelSellOrder = (sellOrder: SellOrder) => {
    return this.apiRequest(() => {
      return this.tradeApi.deleteTrade(sellOrder.tradeId);
    });
  };

  cancelBuyOffer = (offer: BuyOffer) => {
    return this.apiRequest(() => {
      return this.tradeApi.deleteTradeRequest(offer.offerId);
    });
  };

  getBuyRequestTx = (sellOrder: SellOrder, from: Address): Promise<CrossTx> => {
    return this.apiRequest(() => {
      return this.txApi.getTxTradeRequest(sellOrder.tradeId, from);
    });
  };

  postBuyOffer = (
    sellOrder: SellOrder,
    from: Address,
    crossTx: CrossTx
  ): Promise<TradeRequest> => {
    return this.apiRequest(() => {
      return this.tradeApi.postTradeRequest({
        tradeId: sellOrder.tradeId,
        from,
        crossTx
      });
    });
  };

  getOpenedBuyOffers = async (
    address: Address,
    quantity: number,
    perUnitPrice: number
  ): Promise<BuyOffer[]> => {
    const tradeRequests = await this.apiRequest(async () => {
      return this.tradeApi.getTradeRequestsByUserId(
        address,
        TradeStatus.TRADE_OPENED,
        TradeRequestStatus.REQUEST_OPENED
      );
    });

    return tradeRequests.map(r => BuyOffer.from(r, quantity, perUnitPrice));
  };

  getBuyOffer = async (
    offer: BuyOffer,
    quantity: number,
    perUnitPrice: number
  ): Promise<BuyOffer> => {
    const response = await this.apiRequest(async () => {
      return this.tradeApi.getTradeRequestById(offer.offerId);
    });

    return BuyOffer.from(response, quantity, perUnitPrice);
  };

  broadcastOrderTx = (
    stdTx: StdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    return this.broadcastTx(this.coordinatorRestClient, stdTx, mode);
  };

  getTradeTxStatus = (txId: string) => {
    return this.getCrossCoordinatorStatus(this.coordinatorRestClient, txId);
  };
}

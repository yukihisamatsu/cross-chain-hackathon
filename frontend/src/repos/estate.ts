import {MarketEstate} from "~models/estate";
import {ORDER_STATUS, SellOrder} from "~models/order";
import {EstateApi, TradeApi, TradeTypeEnum} from "~src/libs/api";
import {RPCClient} from "~src/libs/cosmos/rpc-client";
import {Address} from "~src/types";

export class EstateRepository {
  estateApi: EstateApi;
  tradeApi: TradeApi;
  coinRPCClient: RPCClient;
  securityRPCClient: RPCClient;
  coordinatorRPCClient: RPCClient;

  constructor({
    estateApi,
    tradeApi,
    coinRPCClient,
    securityRPCClient,
    coordinatorRPCClient
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    coinRPCClient: RPCClient;
    securityRPCClient: RPCClient;
    coordinatorRPCClient: RPCClient;
  }) {
    this.estateApi = estateApi;
    this.tradeApi = tradeApi;
    this.coinRPCClient = coinRPCClient;
    this.securityRPCClient = securityRPCClient;
    this.coordinatorRPCClient = coordinatorRPCClient;
  }

  static create({
    estateApi,
    tradeApi,
    coinRPCClient,
    securityRPCClient,
    coordinatorRPCClient
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    coinRPCClient: RPCClient;
    securityRPCClient: RPCClient;
    coordinatorRPCClient: RPCClient;
  }): EstateRepository {
    return new EstateRepository({
      estateApi,
      tradeApi,
      coinRPCClient,
      securityRPCClient,
      coordinatorRPCClient
    });
  }

  getMarketEstates = async (): Promise<MarketEstate[]> => {
    const {data: estates} = await this.estateApi.getEstates();

    return estates.map(estate => {
      const {
        tokenId,
        name,
        imagePath,
        description,
        issuedBy,
        dividendDate,
        expectedYield,
        offerPrice
      } = estate;

      return {
        tokenId,
        name,
        imagePath,
        description,
        issuedBy,
        dividendDate,
        expectedYield,
        offerPrice,
        sellOrders: []
      };
    });
  };

  getMarketEstate = async (
    estateId: string,
    owner: Address
  ): Promise<MarketEstate> => {
    const {
      data: {
        estate: {
          tokenId,
          name,
          imagePath,
          description,
          issuedBy,
          dividendDate,
          expectedYield,
          offerPrice
        },
        trades
      }
    } = await this.estateApi.getEstateById(estateId);

    const sellOrders: SellOrder[] = trades
      .filter(trade => {
        return (
          trade.type === TradeTypeEnum.Sell &&
          trade.seller !== owner &&
          !trade.canceled &&
          trade.estateId === estateId
        );
      })
      .map(({id, amount, seller, unitPrice, updatedAt}) => {
        return new SellOrder({
          tradeId: id,
          tokenId: estateId,
          owner: seller,
          total: amount,
          perUnitPrice: unitPrice,
          quantity: amount / unitPrice,
          status: ORDER_STATUS.REQUESTING, // TODO get from contract
          buyOffers: [],
          updatedAt
        });
      });

    return {
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      offerPrice,
      expectedYield,
      sellOrders
    };
  };

  // getOwnedEstates = async (owner: string): Promise<OwnedEstate[]> => {
  //   const {data: estates} = await this.estateApi.getEstates();
  //
  //   return estates.map(estate => {
  //     const {
  //       tokenId,
  //       name,
  //       imagePath,
  //       description,
  //       issuedBy,
  //       dividendDate,
  //       expectedYield,
  //       offerPrice
  //     } = estate;
  //
  //     return {
  //       tokenId,
  //       name,
  //       imagePath,
  //       description,
  //       issuedBy,
  //       dividendDate,
  //       expectedYield,
  //       offerPrice,
  //       owner,
  //       userDividend: [] // TODO
  //       status: ESTATE_STATUS.OWNED, // tradeの中を見て判定
  //       buyOffers
  //
  //     };
  //   });
  //   //  balanceOfで残高を持っているか確認
  // };
}

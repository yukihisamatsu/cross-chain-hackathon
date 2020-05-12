import {DateTime} from "luxon";

import {ESTATE_STATUS, MarketEstate, OwnedEstate} from "~models/estate";
import {ORDER_STATUS, SellOrder} from "~models/order";
import {
  Estate as EstateDAO,
  EstateApi,
  TradeApi,
  TradeStatus,
  TradeType
} from "~src/libs/api";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {BaseRepo} from "~src/repos/base";
import {Address} from "~src/types";

export class EstateRepository extends BaseRepo {
  estateApi: EstateApi;
  tradeApi: TradeApi;
  estateContract: EstateContract;

  constructor({
    estateApi,
    tradeApi,
    estateContract
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    estateContract: EstateContract;
  }) {
    super();
    this.estateApi = estateApi;
    this.tradeApi = tradeApi;
    this.estateContract = estateContract;
  }

  static create({
    estateApi,
    tradeApi,
    estateContract
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    estateContract: EstateContract;
  }): EstateRepository {
    return new EstateRepository({
      estateApi,
      tradeApi,
      estateContract
    });
  }

  getMarketEstates = async (owner: Address): Promise<MarketEstate[]> => {
    const {data: daos} = await this.estateApi.getEstates();
    return await Promise.all(
      daos.map(async (dao: EstateDAO) => await this.toMarketEstate(dao, owner))
    );
  };

  getMarketEstate = async (
    estateId: string,
    owner: Address
  ): Promise<MarketEstate> => {
    const {data: dao} = await this.estateApi.getEstateById(estateId);
    return this.toMarketEstate(dao, owner);
  };

  private toMarketEstate(dao: EstateDAO, owner: Address): MarketEstate {
    const {
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      expectedYield,
      offerPrice,
      trades
    } = dao;

    const sellOrders: SellOrder[] = trades
      .filter(trade => {
        return (
          trade.type === TradeType.SELL &&
          trade.seller !== owner &&
          !trade.status &&
          trade.estateId === tokenId
        );
      })
      .map(({id, amount, seller, unitPrice, updatedAt}) => {
        return new SellOrder({
          tradeId: id,
          tokenId,
          owner: seller,
          total: amount,
          perUnitPrice: unitPrice,
          quantity: amount / unitPrice,
          status: ORDER_STATUS.REQUESTING, // TODO get from contract
          buyOffers: [],
          updatedAt
        });
      });

    return new MarketEstate({
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      offerPrice,
      expectedYield,
      sellOrders
    });
  }

  getOwnedEstates = async (owner: Address): Promise<OwnedEstate[]> => {
    const {data: daos} = await this.estateApi.getEstates();
    const ret = (
      await Promise.all(
        daos.map(async (dao: EstateDAO) => await this.toOwnedEstate(dao, owner))
      )
    ).filter(e => e.units > 0);

    return ret as OwnedEstate[];
  };

  getOwnedEstate = async (
    estateId: string,
    owner: Address
  ): Promise<OwnedEstate> => {
    const {data: dao} = await this.estateApi.getEstateById(estateId);
    return this.toOwnedEstate(dao, owner);
  };

  private toOwnedEstate = async (
    dao: EstateDAO,
    owner: Address
  ): Promise<OwnedEstate> => {
    const {
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      expectedYield,
      offerPrice
    } = dao;

    const units = await this.estateContract.balanceOf(owner, tokenId);

    return new OwnedEstate({
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      expectedYield,
      offerPrice,
      units: units.toNumber(),
      buyOffers: [], // TODO
      dividend: [], // TODO
      status: ESTATE_STATUS.OWNED // TODO
    });
  };

  postSellOrder = async (
    estate: OwnedEstate,
    amount: number,
    perUnit: number,
    seller: Address
  ) => {
    await this.apiRequest(() =>
      this.tradeApi.postTrade({
        estateId: estate.tokenId,
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
}

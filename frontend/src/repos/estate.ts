import {
  ESTATE_STATUS,
  IssuerEstate,
  MarketEstate,
  OwnedEstate
} from "~models/estate";
import {BuyOffer, SellOrder} from "~models/order";
import {
  Estate as EstateDAO,
  EstateApi,
  TradeApi,
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
          trade.estateId === tokenId
        );
      })
      .map(({id, amount, seller, unitPrice, status, requests, updatedAt}) => {
        return new SellOrder({
          tradeId: id,
          tokenId,
          owner: seller,
          perUnitPrice: unitPrice,
          quantity: amount,
          status: SellOrder.getStatus(status),
          buyOffers: Array.isArray(requests)
            ? requests.map(req => BuyOffer.from(req, amount, unitPrice))
            : [],
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
    ).filter(e => e.units > 0 || e.status === ESTATE_STATUS.BUYING);

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
      offerPrice,
      trades
    } = dao;

    const units = await this.estateContract.balanceOf(owner, tokenId);

    const sellOrders: SellOrder[] = trades
      .filter(trade => {
        return (
          (trade.seller === owner ||
            trade.requests.find(req => req.from === owner)) &&
          trade.estateId === tokenId
        );
      })
      .map(trade => {
        const {
          id: tradeId,
          estateId: tokenId,
          seller: owner,
          amount: quantity,
          unitPrice: perUnitPrice,
          // buyer,
          requests,
          status,
          updatedAt
        } = trade;

        return new SellOrder({
          tradeId,
          tokenId,
          owner,
          quantity,
          perUnitPrice,
          status: SellOrder.getStatus(status),
          buyOffers: Array.isArray(requests)
            ? requests.map(req => BuyOffer.from(req, quantity, perUnitPrice))
            : [],
          updatedAt
        });
      });

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
      status: OwnedEstate.getStatus(sellOrders, owner),
      sellOrders,
      dividend: [] // TODO
    });
  };

  getIssuerEstates = async (): Promise<IssuerEstate[]> => {
    const {data: daos} = await this.estateApi.getEstates();
    return await Promise.all(
      daos.map(async (dao: EstateDAO) => await this.toIssuerEstate(dao))
    );
  };

  private toIssuerEstate(dao: EstateDAO): IssuerEstate {
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

    return new IssuerEstate({
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      offerPrice,
      expectedYield,
      owners: [],
      issuerDividend: [],
      histories: []
    });
  }
}

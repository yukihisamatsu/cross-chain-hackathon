import BN from "bn.js";
import log from "loglevel";

import {
  DIVIDEND_HISTORY_STATUS,
  DividendHistory,
  DividendOwner,
  PaidOnlyDividendHistory
} from "~models/dividend";
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
  TradeType,
  UserApi
} from "~src/libs/api";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {GetTxsResponseTx, RestClient} from "~src/libs/cosmos/rest-client";
import {BaseRepo} from "~src/repos/base";
import {Address} from "~src/types";

export class EstateRepository extends BaseRepo {
  estateApi: EstateApi;
  tradeApi: TradeApi;
  userApi: UserApi;
  estateContract: EstateContract;
  securityRestClient: RestClient;

  constructor({
    estateApi,
    tradeApi,
    userApi,
    estateContract,
    securityRestClient
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    userApi: UserApi;
    estateContract: EstateContract;
    securityRestClient: RestClient;
  }) {
    super();
    this.estateApi = estateApi;
    this.tradeApi = tradeApi;
    this.userApi = userApi;
    this.estateContract = estateContract;
    this.securityRestClient = securityRestClient;
  }

  static create({
    estateApi,
    tradeApi,
    userApi,
    estateContract,
    securityRestClient
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
    userApi: UserApi;
    estateContract: EstateContract;
    securityRestClient: RestClient;
  }): EstateRepository {
    return new EstateRepository({
      estateApi,
      tradeApi,
      userApi,
      estateContract,
      securityRestClient
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
    const estate = await this.toOwnedEstate(dao, owner);
    estate.dividendHistories = await this.getDividendHistories(estate.tokenId);

    return estate;
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
      dividendHistories: []
    });
  };

  getIssuerEstates = async (): Promise<IssuerEstate[]> => {
    const {data: daos} = await this.estateApi.getEstates();
    return await Promise.all(
      daos.map(async (dao: EstateDAO) => await this.toIssuerEstate(dao))
    );
  };

  getIssuerEstate = async (
    estateId: string,
    _: Address
  ): Promise<IssuerEstate> => {
    const {data: dao} = await this.estateApi.getEstateById(estateId);
    const estate = await this.toIssuerEstate(dao);
    const {data: users} = await this.userApi.getUsers();

    estate.owners = await Promise.all(
      users.map(async user => {
        const balance = (
          await this.estateContract.balanceOf(user.id, estateId)
        ).toNumber();
        return new DividendOwner({
          name: user.name,
          address: user.id,
          balance
        });
      })
    );

    const sumBalance = estate.owners.reduce(
      (acc, user) => acc + user.balance,
      0
    );

    estate.histories = await this.getDividendHistories(
      estate.tokenId,
      sumBalance
    );

    return estate;
  };

  private toIssuerEstate = (dao: EstateDAO): IssuerEstate => {
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
      histories: []
    });
  };

  private getDividendHistories = async (
    tokenId: string,
    sumBalance = 0
  ): Promise<DividendHistory[]> => {
    const registeredTxs: GetTxsResponseTx[] = (
      await this.securityRestClient.txs({
        "DividendRegistered.tokenID": tokenId
      })
    ).txs;
    log.debug("registeredTxs", registeredTxs);

    const registeredHistories: DividendHistory[] = registeredTxs
      .flatMap(tx => {
        return tx.logs.flatMap(log =>
          log.events
            .filter(event => event.type === "DividendRegistered")
            .map(event => {
              // DividendRegistered event struct
              // attributes[0] = tokenID
              // attributes[1] = index
              // attributes[2] = perShare
              const perShare = event.attributes[2]?.value
                ? Number(event.attributes[2].value)
                : 0;
              return new DividendHistory({
                index: event.attributes[1]?.value
                  ? Number(event.attributes[1].value)
                  : -1,
                registeredHeight: Number(tx.height),
                registeredTimeStamp: tx.timestamp,
                registeredTxHash: tx.txhash,
                perUnit: perShare,
                total: new BN(sumBalance).muln(perShare).toNumber(),
                status: DIVIDEND_HISTORY_STATUS.REGISTERED
              });
            })
        );
      })
      .sort((a, b) => (a.index < b.index ? 1 : -1));

    const distributedTxs: GetTxsResponseTx[] = (
      await this.securityRestClient.txs({
        "DividendPaid.tokenID": tokenId
      })
    ).txs;
    log.debug("distributedTxs", distributedTxs);

    const paidHistoryIndexMap: {
      [index: number]: PaidOnlyDividendHistory;
    } = {};
    distributedTxs.flatMap(tx => {
      return tx.logs.flatMap(log =>
        log.events
          .filter(event => event.type === "DividendPaid")
          .forEach(event => {
            // DividendPaid event struct
            // attributes[0] = tokenID
            // attributes[1] = index
            const index = event.attributes[1]?.value
              ? Number(event.attributes[1].value)
              : -1;
            paidHistoryIndexMap[index] = {
              distributedHeight: Number(tx.height),
              distributedTimeStamp: tx.timestamp,
              distributedTxHash: tx.txhash,
              status: DIVIDEND_HISTORY_STATUS.DISTRIBUTED
            };
          })
      );
    });

    return registeredHistories.map(registered => {
      if (!paidHistoryIndexMap[registered.index]) {
        return registered;
      }
      const paidHistory = paidHistoryIndexMap[registered.index];
      return registered.merge(paidHistory);
    });
  };
}

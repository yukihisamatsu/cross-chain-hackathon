import {MarketEstate} from "~models/estate";
import {EstateApi, TradeApi} from "~src/libs/api";
import {Address} from "~src/types";

export class EstateRepository {
  estateApi: EstateApi;
  tradeApi: TradeApi;

  constructor({
    estateApi,
    tradeApi
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
  }) {
    this.estateApi = estateApi;
    this.tradeApi = tradeApi;
  }

  static create({
    estateApi,
    tradeApi
  }: {
    estateApi: EstateApi;
    tradeApi: TradeApi;
  }): EstateRepository {
    return new EstateRepository({estateApi, tradeApi});
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
        expectedYield
      } = estate;

      return {
        ...MarketEstate.default(),
        tokenId,
        name,
        imagePath,
        description,
        issuedBy,
        dividendDate,
        expectedYield,
        sellOrders: []
      };
    });
  };

  getMarketEstate = async (
    estateId: string,
    _: Address
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
          expectedYield
        }
      }
    } = await this.estateApi.getEstateById(estateId);

    return {
      ...MarketEstate.default(),
      tokenId,
      name,
      imagePath,
      description,
      issuedBy,
      dividendDate,
      expectedYield,
      sellOrders: [] // TODO
    };
  };
}

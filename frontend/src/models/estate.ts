import BN from "bn.js";
import {DateTime} from "luxon";

import {DividendHistory, IssuerDividend} from "~models/dividend";
import {Unbox} from "~src/heplers/util-types";
import {BuyOrder, ORDER_STATUS, SellOrder} from "~src/models/order";
import {Address} from "~src/types";

export const ESTATE_STATUS = {
  OWNED: "owned",
  SELLING: "selling",
  BUYING: "buying"
} as const;
export type EstateStatusType = Unbox<typeof ESTATE_STATUS>;

export type EstateExtend = MarketEstate | OwnedEstate | IssuerEstate;

export class Estate {
  tokenId: string;
  name: string;
  imagePath: string;
  description: string;
  expectedYield: number;
  dividendDate: string;
  offerPrice: number;
  issuedBy: Address;

  units?: number;
  status?: EstateStatusType;

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYield,
    dividendDate,
    offerPrice,
    issuedBy
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
    offerPrice: number;
    issuedBy: Address;
  }) {
    this.tokenId = tokenId;
    this.name = name;
    this.imagePath = imagePath;
    this.description = description;
    this.expectedYield = expectedYield;
    this.dividendDate = dividendDate;
    this.offerPrice = offerPrice;
    this.issuedBy = issuedBy;
  }
}

export class OwnedEstate extends Estate {
  units: number;
  status: EstateStatusType;
  dividend: DividendHistory[];
  sellOrders: SellOrder[];

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYield,
    dividendDate,
    offerPrice,
    issuedBy,
    units,
    status,
    dividend,
    sellOrders
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
    offerPrice: number;
    issuedBy: Address;
    units: number;
    status: EstateStatusType;
    dividend: DividendHistory[];
    sellOrders: SellOrder[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYield,
      dividendDate,
      offerPrice,
      issuedBy
    });

    this.units = units;
    this.status = status;
    this.dividend = dividend;
    this.sellOrders = sellOrders;
  }

  static default = (): OwnedEstate => {
    return new OwnedEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYield: 0,
      dividendDate: "",
      offerPrice: 0,
      issuedBy: "",
      units: 0,
      status: ESTATE_STATUS.OWNED,
      dividend: [],
      sellOrders: []
    });
  };

  static fromBuyOrder(marketEstate: MarketEstate, buyOrder: BuyOrder) {
    return new OwnedEstate({
      tokenId: marketEstate.tokenId,
      name: marketEstate.name,
      imagePath: marketEstate.imagePath,
      description: marketEstate.description,
      expectedYield: marketEstate.expectedYield,
      dividendDate: marketEstate.dividendDate,
      offerPrice: marketEstate.offerPrice,
      issuedBy: marketEstate.issuedBy,
      units: buyOrder.quantity,
      status: ESTATE_STATUS.BUYING,
      dividend: [],
      sellOrders: []
    });
  }

  static getStatus(sellOrders: SellOrder[]): EstateStatusType {
    const opened = sellOrders.find(
      order => order.status === ORDER_STATUS.OPENED
    );

    let status: EstateStatusType;
    if (opened) {
      if (
        opened.buyOffers.find(offer => offer.status === ORDER_STATUS.OPENED)
      ) {
        status = ESTATE_STATUS.BUYING;
      } else {
        status = ESTATE_STATUS.SELLING;
      }
    } else {
      status = ESTATE_STATUS.OWNED;
    }

    return status;
  }

  getTotal(perUnit: number): number {
    return new BN(this.units).muln(perUnit).toNumber();
  }

  sortDescSellOrder = (): SellOrder[] =>
    this.sellOrders.sort(
      (a: SellOrder, b: SellOrder) =>
        DateTime.fromISO(b.updatedAt).toSeconds() -
        DateTime.fromISO(a.updatedAt).toSeconds()
    );

  findActiveSellOrder = (): SellOrder | null => {
    return (
      this.sortDescSellOrder().find(
        order => order.status === ORDER_STATUS.OPENED
      ) ?? null
    );
  };

  findActiveOwnedBuyOffer = (offerer: Address): BuyOrder | null => {
    const activeSellOrder = this.sortDescSellOrder().find(
      order =>
        order.status === ORDER_STATUS.OPENED &&
        order.buyOffers.find(offer => offer.offerer === offerer)
    );

    if (!activeSellOrder) {
      return null;
    }

    return activeSellOrder.buyOffers[0];
  };
}

export class MarketEstate extends Estate {
  sellOrders: SellOrder[];

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYield,
    dividendDate,
    offerPrice,
    issuedBy,
    sellOrders
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
    offerPrice: number;
    issuedBy: Address;
    sellOrders: SellOrder[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYield,
      dividendDate,
      offerPrice,
      issuedBy
    });

    this.sellOrders = sellOrders;
  }

  static default = (): MarketEstate => {
    return new MarketEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYield: 0,
      dividendDate: "",
      offerPrice: 0,
      issuedBy: "",
      sellOrders: []
    });
  };

  getUnFinishedSellOrders(): SellOrder[] {
    return this.sellOrders.filter(
      order =>
        order.status === ORDER_STATUS.OPENED ||
        order.status === ORDER_STATUS.FAILED
    );
  }
}

export class IssuerEstate extends Estate {
  issuerDividend: IssuerDividend[];
  histories: DividendHistory[];

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYield,
    dividendDate,
    offerPrice,
    issuedBy,
    issuerDividend,
    histories
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
    offerPrice: number;
    issuedBy: Address;
    issuerDividend: IssuerDividend[];
    histories: DividendHistory[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYield,
      dividendDate,
      offerPrice,
      issuedBy
    });

    this.issuerDividend = issuerDividend;
    this.histories = histories;
  }

  static default = (): IssuerEstate => {
    return new IssuerEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYield: 0,
      dividendDate: "",
      offerPrice: 0,
      issuedBy: "",
      issuerDividend: [],
      histories: []
    });
  };
}

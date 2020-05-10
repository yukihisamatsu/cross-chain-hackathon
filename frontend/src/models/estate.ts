import BN from "bn.js";

import {DividendHistory, IssuerDividend} from "~models/dividend";
import {Unbox} from "~src/heplers/util-types";
import {BuyOrder, SellOrder} from "~src/models/order";
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
  userDividend: DividendHistory[];
  buyOffers: BuyOrder[];

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
    buyOffers
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
    buyOffers: BuyOrder[];
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
    this.userDividend = dividend;
    this.buyOffers = buyOffers;
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
      buyOffers: []
    });
  };

  getTotal(perUnit: number): number {
    return new BN(this.units).muln(perUnit).toNumber();
  }
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

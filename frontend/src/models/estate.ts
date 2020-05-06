import {Unbox} from "~src/heplers/util-types";
import {Dividend} from "~src/models/dividend";
import {BuyOrder, SellOrder} from "~src/models/order";

export const ESTATE_STATUS = {
  OWNED: "owned",
  SELLING: "selling",
  BUYING: "buying"
} as const;
export type EstateStatusType = Unbox<typeof ESTATE_STATUS>;

export class Estate {
  tokenId: string;
  name: string;
  imagePath: string;
  description: string;
  expectedYieldRatio: string;
  dividendDate: string;
  issuedBy: string;

  owner?: string;
  units?: number;
  perUnit?: number;
  status?: EstateStatusType;
  dividend?: Dividend[];
  sellOrder?: SellOrder;

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYieldRatio,
    dividendDate,
    issuedBy
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYieldRatio: string;
    dividendDate: string;
    issuedBy: string;
  }) {
    this.tokenId = tokenId;
    this.name = name;
    this.imagePath = imagePath;
    this.description = description;
    this.expectedYieldRatio = expectedYieldRatio;
    this.dividendDate = dividendDate;
    this.issuedBy = issuedBy;
  }
}

export class OwnedEstate extends Estate {
  owner: string;
  units: number;
  perUnit: number;
  status: EstateStatusType;
  dividend: Dividend[];
  buyOffers: BuyOrder[];

  constructor({
    owner,
    tokenId,
    name,
    imagePath,
    description,
    expectedYieldRatio,
    dividendDate,
    issuedBy,
    units,
    perUnit,
    status,
    dividend,
    buyOffers
  }: {
    owner: string;
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYieldRatio: string;
    dividendDate: string;
    issuedBy: string;
    units: number;
    perUnit: number;
    status: EstateStatusType;
    dividend: Dividend[];
    buyOffers: BuyOrder[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYieldRatio,
      dividendDate,
      issuedBy
    });

    this.owner = owner;
    this.units = units;
    this.perUnit = perUnit;
    this.status = status;
    this.dividend = dividend;
    this.buyOffers = buyOffers;
  }

  static default = (): OwnedEstate => {
    return new OwnedEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYieldRatio: "",
      dividendDate: "",
      issuedBy: "",
      owner: "",
      units: 0,
      perUnit: 0,
      status: ESTATE_STATUS.OWNED,
      dividend: [],
      buyOffers: []
    });
  };
}

export class MarketEstate extends Estate {
  sellOrders: SellOrder[];

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYieldRatio,
    dividendDate,
    issuedBy,
    sellOrders
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYieldRatio: string;
    dividendDate: string;
    issuedBy: string;
    sellOrders: SellOrder[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYieldRatio,
      dividendDate,
      issuedBy
    });

    this.sellOrders = sellOrders;
  }
}

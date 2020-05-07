import {
  IssuerDividend,
  IssuerDividendHistory,
  UserDividend
} from "~models/dividend";
import {Unbox} from "~src/heplers/util-types";
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
  userDividend?: UserDividend[];
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
  userDividend: UserDividend[];
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
    dividend: UserDividend[];
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
    this.userDividend = dividend;
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

  static default = (): MarketEstate => {
    return new MarketEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYieldRatio: "",
      dividendDate: "",
      issuedBy: "",
      sellOrders: []
    });
  };
}

export class IssuerEstate extends Estate {
  issuerDividend: IssuerDividend[];
  histories: IssuerDividendHistory[];

  constructor({
    tokenId,
    name,
    imagePath,
    description,
    expectedYieldRatio,
    dividendDate,
    issuedBy,
    issuerDividend,
    histories
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYieldRatio: string;
    dividendDate: string;
    issuedBy: string;
    issuerDividend: IssuerDividend[];
    histories: IssuerDividendHistory[];
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

    this.issuerDividend = issuerDividend;
    this.histories = histories;
  }

  static default = (): IssuerEstate => {
    return new IssuerEstate({
      tokenId: "",
      name: "",
      imagePath: "",
      description: "",
      expectedYieldRatio: "",
      dividendDate: "",
      issuedBy: "",
      issuerDividend: [],
      histories: []
    });
  };
}

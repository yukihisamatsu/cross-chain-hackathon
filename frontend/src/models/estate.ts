import {
  IssuerDividend,
  IssuerDividendHistory,
  UserDividend
} from "~models/dividend";
import {Unbox} from "~src/heplers/util-types";
import {BuyOrder, SellOrder} from "~src/models/order";
import {Address} from "~src/types";

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
  expectedYield: number;
  dividendDate: string;
  issuedBy: Address;

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
    expectedYield,
    dividendDate,
    issuedBy
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
    issuedBy: Address;
  }) {
    this.tokenId = tokenId;
    this.name = name;
    this.imagePath = imagePath;
    this.description = description;
    this.expectedYield = expectedYield;
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
    expectedYield,
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
    expectedYield: number;
    dividendDate: string;
    issuedBy: Address;
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
      expectedYield,
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
      expectedYield: 0,
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
    expectedYield,
    dividendDate,
    issuedBy,
    sellOrders
  }: {
    tokenId: string;
    name: string;
    imagePath: string;
    description: string;
    expectedYield: number;
    dividendDate: string;
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
    expectedYield,
    dividendDate,
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
    issuedBy: Address;
    issuerDividend: IssuerDividend[];
    histories: IssuerDividendHistory[];
  }) {
    super({
      tokenId,
      name,
      imagePath,
      description,
      expectedYield,
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
      expectedYield: 0,
      dividendDate: "",
      issuedBy: "",
      issuerDividend: [],
      histories: []
    });
  };
}

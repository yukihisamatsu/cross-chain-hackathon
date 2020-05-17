import {
  DIVIDEND_HISTORY_STATUS,
  DividendHistory,
  DividendOwner
} from "~models/dividend";
import {User} from "~models/user";
import {Unbox} from "~src/heplers/util-types";
import {
  BuyOffer,
  OFFER_STATUS,
  ORDER_STATUS,
  SellOrder
} from "~src/models/order";
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

  static getStatus(sellOrders: SellOrder[], owner: Address): EstateStatusType {
    const openedOrder = sellOrders.find(order => order.isOpened());

    if (!openedOrder) {
      return ESTATE_STATUS.OWNED;
    }

    if (openedOrder.isOffering(owner)) {
      return ESTATE_STATUS.BUYING;
    }

    if (openedOrder.isOwned(owner)) {
      return ESTATE_STATUS.SELLING;
    }

    return ESTATE_STATUS.OWNED;
  }

  findActiveSellOrder = (): SellOrder | null => {
    return (
      SellOrder.sortDateDesc(this.sellOrders).find(
        order => order.status === ORDER_STATUS.OPENED
      ) ?? null
    );
  };

  findAllOwnedSellOrdersBuyOffers = (owner: Address): BuyOffer[] => {
    const ret = SellOrder.sortDateDesc(this.sellOrders)
      .filter(order => order.isOwned(owner) && !order.isCancelled())
      .flatMap(order => order.buyOffers);

    return BuyOffer.sortDateDesc(ret);
  };

  findOwnedBuyOffers = (offerer: Address): BuyOffer[] => {
    const ret = SellOrder.sortDateDesc(this.sellOrders)
      .flatMap(order => order.buyOffers)
      .filter(buyOffer => buyOffer.isOwned(offerer));

    return BuyOffer.sortDateDesc(ret);
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

  getUnOfferedSellOrders(user: User): SellOrder[] {
    return this.sellOrders.filter(
      order =>
        order.status === ORDER_STATUS.OPENED &&
        order.owner !== user.address &&
        !order.buyOffers.find(
          offer =>
            offer.offerer === user.address &&
            offer.status === OFFER_STATUS.OPENED
        )
    );
  }
}

export class IssuerEstate extends Estate {
  owners: DividendOwner[];
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
    owners,
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
    owners: DividendOwner[];
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

    this.owners = owners;
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
      owners: [],
      histories: []
    });
  };

  isRegistering(): boolean {
    return !!this.histories.find(
      history =>
        history.status === DIVIDEND_HISTORY_STATUS.REGISTERED ||
        history.status === DIVIDEND_HISTORY_STATUS.ONGOING
    );
  }
}

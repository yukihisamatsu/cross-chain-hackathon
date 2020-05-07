import {
  ISSUER_DIVIDEND_HISTORY_STATUS,
  IssuerDividend,
  IssuerDividendHistory,
  USER_DIVIDEND_STATUS
} from "~models/dividend";
import {
  Estate,
  ESTATE_STATUS,
  IssuerEstate,
  MarketEstate,
  OwnedEstate
} from "~src/models/estate";
import {BuyOrder, ORDER_STATUS, SellOrder} from "~src/models/order";

const buyOffers: BuyOrder[] = [
  new BuyOrder({
    tradeId: 10,
    tokenId: "offerer103tokenId",
    offerer: "offerer101",
    perUnitPrice: 10,
    quantity: 50,
    total: 500,
    status: ORDER_STATUS.REQUESTING,
    sellOffers: []
  }),
  new BuyOrder({
    tradeId: 11,
    tokenId: "offerer103tokenId",
    offerer: "offerer102",
    perUnitPrice: 1,
    quantity: 10,
    total: 10,
    status: ORDER_STATUS.ONGOING,
    sellOffers: []
  }),
  new BuyOrder({
    tradeId: 12,
    tokenId: "offerer103tokenId",
    offerer: "offerer103",
    perUnitPrice: 100,
    quantity: 500,
    total: 50000,
    status: ORDER_STATUS.SUCCEEDED,
    sellOffers: []
  }),
  new BuyOrder({
    tradeId: 13,
    tokenId: "offerer104tokenId",
    offerer: "offerer104",
    perUnitPrice: 100,
    quantity: 500,
    total: 50000,
    status: ORDER_STATUS.FAILED,
    sellOffers: []
  })
];

const dummyEstateList: Estate[] = [0, 1, 2, 3, 4, 5].map(i => {
  const id = i + 100;
  const e: Estate = {
    tokenId: `${id}`,
    name: `name${id}`,
    description:
      "288m parcel near Scripting Origin City, 378m from the origin, with a 16m build height and near to Power Piaza, Infin...",
    dividendDate: "2020/05/05 00:00:00 UTC",
    expectedYieldRatio: "1",
    imagePath: `/assets/img/0${i + 1}.jpg`,
    issuedBy: "issuerName"
  };
  return e;
});

export const dummyOwnedEstateList: OwnedEstate[] = dummyEstateList.map(e => {
  const id = Number(e.tokenId);
  const status =
    id % 3 === 0
      ? ESTATE_STATUS.OWNED
      : id % 3 === 1
      ? ESTATE_STATUS.SELLING
      : ESTATE_STATUS.BUYING;

  const oe: OwnedEstate = {
    ...e,
    owner: `owner${id}`,
    status: status,
    units: id * 2,
    perUnit: id + 1,
    userDividend: [
      {
        dividendDate: "2021/05/05 00:00:00",
        status: USER_DIVIDEND_STATUS.NOT_RECEIVED,
        totalAmount: id
      },
      {
        dividendDate: "2020/05/05 00:00:00",
        status: USER_DIVIDEND_STATUS.RECEIVED,
        totalAmount: id
      },
      {
        dividendDate: "2019/05/05 00:00:00",
        status: USER_DIVIDEND_STATUS.RECEIVED,
        totalAmount: id
      }
    ],
    buyOffers: status !== ESTATE_STATUS.OWNED ? buyOffers : []
  };

  return oe;
});

export const dummyMarketEstateList: MarketEstate[] = dummyEstateList.map(e => {
  return {
    ...e,
    sellOrders: [
      new SellOrder({
        tradeId: 1,
        tokenId: "offerer1tokenId",
        owner: "owner1",
        perUnitPrice: 10,
        quantity: 50,
        total: 500,
        status: ORDER_STATUS.SUCCEEDED,
        buyOffers: status === ESTATE_STATUS.SELLING ? buyOffers : []
      }),
      new SellOrder({
        tradeId: 2,
        tokenId: "offerer1tokenId",
        owner: "owner2",
        perUnitPrice: 11,
        quantity: 51,
        total: 551,
        status: ORDER_STATUS.REQUESTING,
        buyOffers: status === ESTATE_STATUS.SELLING ? buyOffers : []
      }),
      new SellOrder({
        tradeId: 3,
        tokenId: "offerer1tokenId",
        owner: "owner3",
        perUnitPrice: 100,
        quantity: 500,
        total: 50000,
        status: ORDER_STATUS.ONGOING,
        buyOffers: status === ESTATE_STATUS.SELLING ? buyOffers : []
      }),
      new SellOrder({
        tradeId: 4,
        tokenId: "offerer1tokenId",
        owner: "owner3",
        perUnitPrice: 200,
        quantity: 500,
        total: 100000,
        status: ORDER_STATUS.FAILED,
        buyOffers: status === ESTATE_STATUS.SELLING ? buyOffers : []
      })
    ]
  };
});

export const dummyIssuerEstateList: IssuerEstate[] = dummyEstateList.map(e => {
  return {
    ...e,
    issuerDividend: [
      new IssuerDividend({
        userName: "userName1",
        userAddress: "userAddress1",
        purchaseDate: "2020/05/05 00:00:00"
      }),
      new IssuerDividend({
        userName: "userName2",
        userAddress: "userAddress2",
        purchaseDate: "2020/05/05 00:00:00"
      }),
      new IssuerDividend({
        userName: "userName3",
        userAddress: "userAddress3",
        purchaseDate: "2020/05/05 00:00:00"
      })
    ],
    histories: [
      new IssuerDividendHistory({
        id: "history1",
        dividendDate: "2021/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.NOT_DISTRIBUTED
      }),
      new IssuerDividendHistory({
        id: "history2",
        dividendDate: "2019/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.ONGOING
      }),
      new IssuerDividendHistory({
        id: "history3",
        dividendDate: "2018/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.DISTRIBUTED
      })
    ]
  };
});

import {
  DividendHistory,
  ISSUER_DIVIDEND_HISTORY_STATUS,
  IssuerDividend
} from "~models/dividend";
import {Estate, IssuerEstate} from "~src/models/estate";
// import {BuyOrder, ORDER_STATUS} from "~src/models/order";

// const buyOffers: BuyOrder[] = [
//   new BuyOrder({
//     tradeId: 10,
//     tokenId: "offerer103tokenId",
//     offerer: "offerer101",
//     perUnitPrice: 10,
//     quantity: 50,
//     total: 500,
//     status: ORDER_STATUS.REQUESTING,
//     sellOffers: []
//   }),
//   new BuyOrder({
//     tradeId: 11,
//     tokenId: "offerer103tokenId",
//     offerer: "offerer102",
//     perUnitPrice: 1,
//     quantity: 10,
//     total: 10,
//     status: ORDER_STATUS.ONGOING,
//     sellOffers: []
//   }),
//   new BuyOrder({
//     tradeId: 12,
//     tokenId: "offerer103tokenId",
//     offerer: "offerer103",
//     perUnitPrice: 100,
//     quantity: 500,
//     total: 50000,
//     status: ORDER_STATUS.SUCCEEDED,
//     sellOffers: []
//   }),
//   new BuyOrder({
//     tradeId: 13,
//     tokenId: "offerer104tokenId",
//     offerer: "offerer104",
//     perUnitPrice: 100,
//     quantity: 500,
//     total: 50000,
//     status: ORDER_STATUS.FAILED,
//     sellOffers: []
//   })
// ];

const dummyEstateList: Estate[] = [0, 1, 2, 3, 4, 5].map(i => {
  const id = i + 100;
  const e: Estate = {
    tokenId: `${id}`,
    name: `name${id}`,
    description:
      "288m parcel near Scripting Origin City, 378m from the origin, with a 16m build height and near to Power Piaza, Infin...",
    dividendDate: "2020/05/05 00:00:00 UTC",
    expectedYield: 1,
    imagePath: `/assets/img/0${i + 1}.jpg`,
    issuedBy: "issuerName",
    offerPrice: 100
  };
  return e;
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
      new DividendHistory({
        id: "history1",
        dividendDate: "2021/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.NOT_DISTRIBUTED
      }),
      new DividendHistory({
        id: "history2",
        dividendDate: "2019/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.ONGOING
      }),
      new DividendHistory({
        id: "history3",
        dividendDate: "2018/05/05 00:00:00",
        total: 100000,
        status: ISSUER_DIVIDEND_HISTORY_STATUS.DISTRIBUTED
      })
    ]
  };
});

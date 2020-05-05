import {
  DIVIDEND_STATUS,
  Estate,
  OWNED_ESTATE_STATUS,
  SELL_ESTATE_ORDER_STATUS
} from "~pages/types";

export const dummyOwnedEstateList: Estate[] = [0, 1, 2, 3, 4, 5, 6].map(i => {
  const id = i + 100;
  return {
    tokenId: `tokenId${id}`,
    name: `name${id}`,
    description:
      "288m parcel near Scripting Origin City, 378m from the origin, with a 16m build height and near to Power Piaza, Infin...",
    dividendDate: "2020/05/05 00:00:00 UTC",
    expectedYieldRatio: "1",
    imagePath: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    issuedBy: "issuerName",
    status:
      id % 2 === 0 ? OWNED_ESTATE_STATUS.BUYING : OWNED_ESTATE_STATUS.SELLING,
    units: id * 2,
    dividend: [
      {
        dividendDate: "2021/05/05 00:00:00",
        status: DIVIDEND_STATUS.NOT_RECEIVED,
        totalAmount: id
      },
      {
        dividendDate: "2020/05/05 00:00:00",
        status: DIVIDEND_STATUS.RECEIVED,
        totalAmount: id
      },
      {
        dividendDate: "2019/05/05 00:00:00",
        status: DIVIDEND_STATUS.RECEIVED,
        totalAmount: id
      }
    ],
    sellOrder: [
      {
        tokenId: "offerer1tokenId",
        offerer: "offerer1",
        perUnitPrice: 10,
        quantity: 50,
        total: 500,
        status: SELL_ESTATE_ORDER_STATUS.OFFERING
      },
      {
        tokenId: "offerer2tokenId",
        offerer: "offerer2",
        perUnitPrice: 1,
        quantity: 10,
        total: 10,
        status: SELL_ESTATE_ORDER_STATUS.RESPONDING
      },
      {
        tokenId: "offerer3tokenId",
        offerer: "offerer3",
        perUnitPrice: 100,
        quantity: 500,
        total: 50000,
        status: SELL_ESTATE_ORDER_STATUS.ONGOING
      }
    ]
  };
});

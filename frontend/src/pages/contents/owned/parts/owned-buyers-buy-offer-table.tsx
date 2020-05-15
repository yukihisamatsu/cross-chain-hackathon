import {Button, Table, Tag} from "antd";
import React from "react";

import {OfferStatusTagColorMap} from "~pages/consts";
import {BuyOffer, OFFER_STATUS, OfferStatusType} from "~src/models/order";

const {Column} = Table;

export const renderOwnedBuyersBuyOfferTable = (
  offers: BuyOffer[],
  onCancel: (offer: BuyOffer) => () => void
) => {
  return (
    <React.Fragment>
      <Table<BuyOffer>
        rowKey={(o: BuyOffer) => o.offerer}
        dataSource={offers}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Offerer" dataIndex="offerer" key="offerer" />
        <Column
          title="Quantity"
          dataIndex="quantity"
          key="quantity"
          width={80}
        />
        <Column
          title="PerUnitPrice"
          dataIndex="perUnitPrice"
          key="perUnitPrice"
        />
        <Column
          title="Total"
          key="total"
          render={(_: string, offer: BuyOffer) => <div>{offer.getTotal()}</div>}
        />
        <Column
          title="Date"
          dataIndex="updatedAt"
          key="updatedAt"
          width={190}
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          width={100}
          render={(status: OfferStatusType) => (
            <Tag color={OfferStatusTagColorMap[status] ?? "green"}>
              {status}
            </Tag>
          )}
        />
        <Column
          title=""
          dataIndex="offerer"
          key="offerer"
          align="center"
          width={150}
          render={(_: string, offer: BuyOffer) =>
            offer.status === OFFER_STATUS.OPENED && (
              <Button type={"default"} danger onClick={onCancel(offer)}>
                CANCEL
              </Button>
            )
          }
        />
        a
      </Table>
    </React.Fragment>
  );
};

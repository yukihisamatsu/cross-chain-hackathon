import {Button, Table, Tag} from "antd";
import React from "react";

import {OrderStatusTagColorMap} from "~pages/consts";
import {BuyOffer, ORDER_STATUS, OrderStatusType} from "~src/models/order";

const {Column} = Table;

export const renderOwnedBuyersBuyOfferTable = (
  offer: BuyOffer | null,
  onCancel: (order: BuyOffer) => () => void
) => {
  return (
    <React.Fragment>
      <Table<BuyOffer>
        rowKey={(o: BuyOffer) => o.offerer}
        dataSource={offer ? [offer] : []}
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
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          width={100}
          render={(status: OrderStatusType) => (
            <Tag color={OrderStatusTagColorMap[status] ?? "green"}>
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
          render={(_: string, order: BuyOffer) =>
            order.status === ORDER_STATUS.OPENED && (
              <Button type={"default"} danger onClick={onCancel(order)}>
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

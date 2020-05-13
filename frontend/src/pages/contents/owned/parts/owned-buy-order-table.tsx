import {Button, Table, Tag} from "antd";
import React from "react";

import {OrderStatusTagColorMap} from "~pages/consts";
import {BuyOffer, ORDER_STATUS, OrderStatusType} from "~src/models/order";

const {Column} = Table;

export const renderOwnedBuyOrderTable = (
  order: BuyOffer | null,
  onCancel: (order: BuyOffer) => () => void
) => {
  return (
    <React.Fragment>
      <Table<BuyOffer>
        rowKey={(o: BuyOffer) => o.offerer}
        dataSource={order ? [order] : []}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Offerer" dataIndex="offerer" key="offerer" width={340} />
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
        <Column title="Total" dataIndex="total" key="total" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          width={150}
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

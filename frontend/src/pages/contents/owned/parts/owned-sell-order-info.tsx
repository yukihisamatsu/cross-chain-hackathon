import {Button, Table} from "antd";
import React from "react";

import {ORDER_STATUS, SellOrder} from "~models/order";

const {Column} = Table;

export const renderOwnedSellOrderInfo = (
  order: SellOrder,
  onCancel: () => void
) => {
  return (
    <Table<SellOrder>
      rowKey={(o: SellOrder) => o.tradeId}
      dataSource={[order]}
      pagination={false}
      bordered
      scroll={{y: 245}}
      size={"small"}
    >
      <Column title="Quantity" dataIndex="quantity" key="quantity" />
      <Column
        title="PerUnitPrice"
        dataIndex="perUnitPrice"
        key="perUnitPrice"
      />
      <Column
        title="Total"
        key="total"
        render={(order: SellOrder) => {
          return order.getTotal();
        }}
      />
      <Column
        title=""
        dataIndex="offerer"
        key="offerer"
        align="center"
        render={(_: string, order: SellOrder) =>
          order.status === ORDER_STATUS.OPENED && (
            <Button type={"default"} danger onClick={onCancel}>
              CANCEL
            </Button>
          )
        }
      />
    </Table>
  );
};

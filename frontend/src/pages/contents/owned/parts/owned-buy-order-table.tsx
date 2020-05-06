import {Button, Table, Tag} from "antd";
import React from "react";

import {OrderStatusTagColorMap} from "~pages/consts";
import {BuyOrder, ORDER_STATUS, OrderStatusType} from "~src/models/order";

const {Column} = Table;

export const renderOwnedBuyOrderTable = (
  order: BuyOrder,
  onCancel: (order: BuyOrder) => () => void
) => {
  return (
    <React.Fragment>
      <Table<BuyOrder>
        rowKey={(o: BuyOrder) => o.offerer}
        dataSource={[order]}
        pagination={false}
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Offerer" dataIndex="offerer" key="offerer" />
        <Column title="Quantity" dataIndex="quantity" key="quantity" />
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
          render={(_: string, order: BuyOrder) =>
            order.status === ORDER_STATUS.REQUESTING && (
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

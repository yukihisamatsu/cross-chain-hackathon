import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {BuyOrder, ORDER_STATUS, OrderStatusType} from "~models/order";
import {OrderStatusTagColorMap} from "~pages/consts";

const {Column} = Table;

export const renderOwnedBuyOfferTable = (
  orders: BuyOrder[],
  onClick: (order: BuyOrder) => () => void
) => {
  return (
    <React.Fragment>
      <BuyOfferInformation>
        <BuyOfferInformationText>BuyOrders</BuyOfferInformationText>
      </BuyOfferInformation>
      <Table<BuyOrder>
        rowKey={(o: BuyOrder) => o.offerer}
        dataSource={orders}
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
              <Button type={"default"} onClick={onClick(order)}>
                ACCEPT
              </Button>
            )
          }
        />
      </Table>
    </React.Fragment>
  );
};

const BuyOfferInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const BuyOfferInformationText = styled.span`
  padding-left: 10px;
`;

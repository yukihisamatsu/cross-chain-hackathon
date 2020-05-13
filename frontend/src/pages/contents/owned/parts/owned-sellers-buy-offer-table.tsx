import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {BuyOffer, ORDER_STATUS, OrderStatusType} from "~models/order";
import {OrderStatusTagColorMap} from "~pages/consts";

const {Column} = Table;

export const renderOwnedSellersBuyOfferTable = (
  orders: BuyOffer[],
  onClick: (order: BuyOffer) => () => void
) => {
  return (
    <React.Fragment>
      <BuyOfferInformation>
        <BuyOfferInformationText>BuyOrders</BuyOfferInformationText>
      </BuyOfferInformation>
      <Table<BuyOffer>
        rowKey={(o: BuyOffer) => o.offerer}
        dataSource={orders}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Offerer" dataIndex="offerer" key="offerer" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          width={120}
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

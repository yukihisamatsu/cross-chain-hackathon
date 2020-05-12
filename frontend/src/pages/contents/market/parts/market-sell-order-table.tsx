import {Button, Table} from "antd";
import React from "react";
import styled from "styled-components";

import {SellOrder} from "~src/models/order";

const {Column} = Table;

export const renderMarketSellOrderTable = (
  orders: SellOrder[],
  onClick: (owner: string) => () => void
) => {
  return (
    <React.Fragment>
      <MarketSellOrderInformation>
        <MarketSellOrderInformationText>
          SellOrders
        </MarketSellOrderInformationText>
      </MarketSellOrderInformation>
      <Table<SellOrder>
        rowKey={(o: SellOrder) => o.owner}
        dataSource={orders}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Owner" dataIndex="owner" key="owner" />
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
          width={180}
        />
        <Column
          title="Total"
          key="total"
          width={180}
          render={(_: string, order: SellOrder) => order.getTotal()}
        />
        <Column
          title=""
          dataIndex="owner"
          key="owner"
          align="center"
          width={150}
          render={(owner: string, _: SellOrder) => (
            <Button type={"default"} onClick={onClick(owner)}>
              BUY NOW
            </Button>
          )}
        />
      </Table>
    </React.Fragment>
  );
};

const MarketSellOrderInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const MarketSellOrderInformationText = styled.span`
  padding-left: 10px;
`;

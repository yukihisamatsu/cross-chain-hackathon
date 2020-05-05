import DoubleRightOutlined from "@ant-design/icons/DoubleRightOutlined";
import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {SellEstateOrderStatusTagColorMap} from "~pages/consts";
import {SellEstateOrder, SellEstateOrderStatusType} from "~pages/types";

const {Column} = Table;

export const renderEstateSellOrderTable = (
  orders: SellEstateOrder[],
  onClick: (tokenId: string) => () => void
) => {
  return (
    <React.Fragment>
      <SellOrderInformation>
        <DoubleRightOutlined />
        <SellOrderInformationText>
          SellOrder Information
        </SellOrderInformationText>
      </SellOrderInformation>
      <Table
        rowKey={(o: SellEstateOrder) => o.offerer}
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
          render={(status: SellEstateOrderStatusType) => (
            <Tag color={SellEstateOrderStatusTagColorMap[status] ?? "green"}>
              {status}
            </Tag>
          )}
        />
        <Column
          title=""
          dataIndex="tokenId"
          key="tokenId"
          render={(tokenId: string) => (
            <Button type={"default"} onClick={onClick(tokenId)}>
              Buy Now
            </Button>
          )}
        />
      </Table>
    </React.Fragment>
  );
};

const SellOrderInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const SellOrderInformationText = styled.span`
  padding-left: 10px;
`;

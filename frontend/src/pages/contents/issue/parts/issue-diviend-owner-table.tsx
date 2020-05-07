import {Table} from "antd";
import React from "react";
import styled from "styled-components";

import {IssuerDividend} from "~models/dividend";

const {Column} = Table;

export const renderIssueDividendOwnerTable = (orders: IssuerDividend[]) => {
  return (
    <React.Fragment>
      <IssueDividendOwnerInformation>
        <IssueDividendOwnerInformationText>
          Owners
        </IssueDividendOwnerInformationText>
      </IssueDividendOwnerInformation>
      <Table<IssuerDividend>
        rowKey={(o: IssuerDividend) => o.userAddress}
        dataSource={orders}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column
          title="UserName"
          dataIndex="userName"
          key="userName"
          width={250}
        />
        <Column title="Address" dataIndex="userAddress" key="userAddress" />
        <Column
          title="PurchaseDate"
          dataIndex="purchaseDate"
          key="purchaseDate"
          width={220}
        />
      </Table>
    </React.Fragment>
  );
};

const IssueDividendOwnerInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const IssueDividendOwnerInformationText = styled.span`
  padding-left: 10px;
`;

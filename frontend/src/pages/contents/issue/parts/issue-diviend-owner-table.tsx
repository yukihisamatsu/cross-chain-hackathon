import {Table} from "antd";
import React from "react";
import styled from "styled-components";

import {DividendOwner} from "~models/dividend";

const {Column, Summary} = Table;

export const renderIssueDividendOwnerTable = (orders: DividendOwner[]) => {
  return (
    <React.Fragment>
      <Title>
        <TitleText>Owners</TitleText>
      </Title>
      <Table<DividendOwner>
        rowKey={(o: DividendOwner) => o.address}
        dataSource={orders}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
        summary={pageData => {
          let totalBalance = 0;

          pageData.forEach((data: DividendOwner) => {
            totalBalance += data.balance;
          });

          return (
            <>
              <Summary.Row>
                <Summary.Cell index={0}>
                  <TotalBalanceText>Total</TotalBalanceText>
                </Summary.Cell>
                <Summary.Cell index={1} />
                <Summary.Cell index={2}>
                  <TotalBalanceText>{totalBalance}</TotalBalanceText>
                </Summary.Cell>
              </Summary.Row>
            </>
          );
        }}
      >
        <Column title="UserName" dataIndex="name" key="name" width={100} />
        <Column title="Address" dataIndex="address" key="address" width={260} />
        <Column title="Units" dataIndex="balance" key="balance" width={250} />
      </Table>
    </React.Fragment>
  );
};

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const TitleText = styled.span`
  padding-left: 10px;
`;

const TotalBalanceText = styled.span`
  font-weight: 600;
`;

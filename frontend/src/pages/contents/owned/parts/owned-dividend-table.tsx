import {Collapse, Table} from "antd";
import React from "react";
import styled from "styled-components";

import {DividendHistory} from "~models/dividend";

const {Panel} = Collapse;

const columns = [
  {
    title: "Timestamp",
    dataIndex: "distributedTimeStamp",
    key: "distributedTimeStamp",
    width: 120
  },
  {
    title: "Quantity",
    dataIndex: "total",
    key: "total"
  }
];

export const renderOwnedDividendTable = (dividends: DividendHistory[]) => {
  return (
    <Collapse
      bordered={true}
      defaultActiveKey={["1"]}
      style={{marginTop: "20px"}}
    >
      <Panel
        style={{}}
        header={
          <DividendInformation>
            <DividendInformationText>
              Dividend Information
            </DividendInformationText>
          </DividendInformation>
        }
        key="1"
      >
        <Table<DividendHistory>
          rowKey={(d: DividendHistory) => d.registeredHeight}
          dataSource={dividends}
          columns={columns}
          pagination={false}
          bordered
          scroll={{y: 220}}
          size={"small"}
        />
      </Panel>
    </Collapse>
  );
};

const DividendInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;
`;

const DividendInformationText = styled.span`
  padding-left: 10px;
`;

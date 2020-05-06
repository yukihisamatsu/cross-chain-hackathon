import {Collapse, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {DividendStatusTagColorMap} from "~pages/consts";
import {Dividend, DividendStatusType} from "~src/models/dividend";

const {Panel} = Collapse;

const columns = [
  {
    title: "Date",
    dataIndex: "dividendDate",
    key: "dividendDate",
    width: 220
  },
  {
    title: "Quantity",
    dataIndex: "totalAmount",
    key: "totalAmount"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 150,
    render: (status: DividendStatusType) => (
      <Tag color={DividendStatusTagColorMap[status] ?? "green"}>{status}</Tag>
    )
  }
];

export const renderOwnedDividendTable = (dividends: Dividend[]) => {
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
        <Table<Dividend>
          rowKey={(d: Dividend) => d.dividendDate}
          dataSource={dividends}
          columns={columns}
          pagination={false}
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

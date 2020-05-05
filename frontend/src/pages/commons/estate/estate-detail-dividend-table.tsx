import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import {Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {DividendStatusTagColorMap} from "~pages/consts";
import {Dividend, DividendStatusType} from "~pages/types";

const columns = [
  {
    title: "Date",
    dataIndex: "dividendDate",
    key: "dividendDate",
    width: 220
  },
  {
    title: "Amount",
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

export const renderEstateDetailDividendTable = (dividends: Dividend[]) => {
  return (
    <React.Fragment>
      <DividendInformation>
        <ScheduleOutlined />
        <DividendInformationText>Dividend Information</DividendInformationText>
      </DividendInformation>
      <Table<Dividend>
        rowKey={(d: Dividend) => d.dividendDate}
        dataSource={dividends}
        columns={columns}
        pagination={false}
        scroll={{y: 220}}
        size={"small"}
      />
    </React.Fragment>
  );
};

const DividendInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const DividendInformationText = styled.span`
  padding-left: 10px;
`;

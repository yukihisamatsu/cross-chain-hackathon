import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {
  DividendHistory,
  ISSUER_DIVIDEND_HISTORY_STATUS,
  IssuerDividendHistoryStatusType
} from "~models/dividend";
import {IssueDividendStatusTagColorMap} from "~pages/consts";

const {Column} = Table;

export const renderIssueDividendHistoryTable = (
  histories: DividendHistory[],
  onClick: (order: DividendHistory) => () => void
) => {
  return (
    <React.Fragment>
      <HistoryInformation>
        <HistoryInformationText>History</HistoryInformationText>
      </HistoryInformation>
      <Table<DividendHistory>
        rowKey={(o: DividendHistory) => o.dividendDate}
        dataSource={histories}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column
          title="Date"
          dataIndex="dividendDate"
          key="dividendDate"
          width={220}
        />
        <Column title="Total" dataIndex="total" key="total" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          width={150}
          render={(status: IssuerDividendHistoryStatusType) => (
            <Tag color={IssueDividendStatusTagColorMap[status] ?? "green"}>
              {status}
            </Tag>
          )}
        />
        <Column
          title=""
          dataIndex=""
          key=""
          align="center"
          width={200}
          render={(_: string, history: DividendHistory) =>
            history.status ===
              ISSUER_DIVIDEND_HISTORY_STATUS.NOT_DISTRIBUTED && (
              <Button type={"default"} onClick={onClick(history)}>
                DISTRIBUTE NOW
              </Button>
            )
          }
        />
      </Table>
    </React.Fragment>
  );
};

const HistoryInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const HistoryInformationText = styled.span`
  padding-left: 10px;
`;

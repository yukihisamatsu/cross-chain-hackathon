import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {
  DIVIDEND_HISTORY_STATUS,
  DividendHistory,
  DividendHistoryStatusType
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
        rowKey={(o: DividendHistory) => o.height}
        dataSource={histories}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column
          title="Block Height"
          dataIndex="height"
          key="height"
          width={120}
        />
        <Column title="Total" dataIndex="total" key="total" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          width={150}
          render={(status: DividendHistoryStatusType) => (
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
            history.status === DIVIDEND_HISTORY_STATUS.REGISTERED && (
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

import {Collapse, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {DividendHistory, DividendHistoryStatusType} from "~models/dividend";
import {DividendHistoryStatusTagColorMap} from "~pages/consts";

const {Panel} = Collapse;
const {Column} = Table;

export const renderOwnedDividendHistoryTable = (
  histories: DividendHistory[]
) => {
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
          rowKey={(o: DividendHistory) => o.registeredHeight}
          dataSource={histories}
          pagination={false}
          bordered
          scroll={{y: 245}}
          size={"small"}
        >
          <Column
            title="Registered Date"
            dataIndex="registeredTimeStamp"
            key="registeredTimeStamp"
            width={200}
          />
          <Column
            title="Dividend Date"
            dataIndex="distributedTimeStamp"
            key="registeredTimeStamp"
            width={200}
          />
          {/*<Column title="Total" dataIndex="total" key="total" />*/}
          <Column
            title="Status"
            dataIndex="status"
            key="status"
            align="center"
            width={100}
            render={(status: DividendHistoryStatusType) => (
              <Tag color={DividendHistoryStatusTagColorMap[status] ?? "green"}>
                {status}
              </Tag>
            )}
          />
        </Table>
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

import {Button, Table} from "antd";
import React from "react";

import {ESTATE_STATUS, OwnedEstate} from "~src/models/estate";

const {Column} = Table;

export const renderOwnedSellOrderInfo = (
  estate: OwnedEstate,
  onCancel: () => void
) => {
  return (
    <Table<OwnedEstate>
      rowKey={(o: OwnedEstate) => o.owner}
      dataSource={[estate]}
      pagination={false}
      bordered
      scroll={{y: 245}}
      size={"small"}
    >
      <Column title="Quantity" dataIndex="units" key="quantity" />
      <Column title="PerUnitPrice" dataIndex="perUnit" key="perUnitPrice" />
      <Column
        title="Total"
        key="total"
        render={(estate: OwnedEstate) => {
          return estate.units * estate.perUnit;
        }}
      />
      <Column
        title=""
        dataIndex="offerer"
        key="offerer"
        align="center"
        render={(_: string, estate: OwnedEstate) =>
          estate.status === ESTATE_STATUS.SELLING && (
            <Button type={"default"} danger onClick={onCancel}>
              CANCEL
            </Button>
          )
        }
      />
    </Table>
  );
};

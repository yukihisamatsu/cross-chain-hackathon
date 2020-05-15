import {Button, Table, Tag} from "antd";
import React from "react";
import styled from "styled-components";

import {BuyOffer, OFFER_STATUS, OfferStatusType} from "~models/order";
import {OfferStatusTagColorMap} from "~pages/consts";

const {Column} = Table;

export const renderOwnedSellersBuyOfferTable = (
  offers: BuyOffer[],
  onClick: (order: BuyOffer) => () => void
) => {
  return (
    <React.Fragment>
      <BuyOfferInformation>
        <BuyOfferInformationText>BuyOrders</BuyOfferInformationText>
      </BuyOfferInformation>
      <Table<BuyOffer>
        rowKey={(o: BuyOffer) => o.offerer}
        dataSource={offers}
        pagination={false}
        bordered
        scroll={{y: 245}}
        size={"small"}
      >
        <Column title="Offerer" dataIndex="offerer" key="offerer" />
        <Column
          title="Date"
          dataIndex="updatedAt"
          key="updatedAt"
          width={190}
        />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          align="center"
          width={120}
          render={(status: OfferStatusType) => (
            <Tag color={OfferStatusTagColorMap[status] ?? "green"}>
              {status}
            </Tag>
          )}
        />
        <Column
          title=""
          dataIndex="offerer"
          key="offerer"
          align="center"
          width={150}
          render={(_: string, offer: BuyOffer) =>
            offer.status === OFFER_STATUS.OPENED && (
              <Button type={"default"} onClick={onClick(offer)}>
                ACCEPT
              </Button>
            )
          }
        />
      </Table>
    </React.Fragment>
  );
};

const BuyOfferInformation = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: black;

  padding: 20px 0;
`;

const BuyOfferInformationText = styled.span`
  padding-left: 10px;
`;

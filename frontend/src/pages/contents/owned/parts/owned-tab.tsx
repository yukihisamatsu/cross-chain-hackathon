import {Tabs} from "antd";
import React from "react";
import styled from "styled-components";

import {renderOwnedBuyOfferTable} from "~pages/contents/owned/parts/owned-buy-offer-table";
import {renderOwnedBuyOrderTable} from "~pages/contents/owned/parts/owned-buy-order-table";
import {renderOwnedSellOrderForm} from "~pages/contents/owned/parts/owned-sell-order-form";
import {renderOwnedSellOrderInfo} from "~pages/contents/owned/parts/owned-sell-order-info";
import {ESTATE_STATUS, OwnedEstate} from "~src/models/estate";
import {BuyOrder} from "~src/models/order";

const {TabPane} = Tabs;

export const renderEstateOrderTab = (
  estate: OwnedEstate,
  handleSellOrderFormSubmit: (values: {[key: string]: string | number}) => void,
  handleChancelSellOrder: () => void,
  handleChancelBuyOrder: (order: BuyOrder) => () => void,
  handleBuyOfferClick: (order: BuyOrder) => () => void
) => {
  return (
    <EstateOrderTabWrap className={"card-container"}>
      <Tabs type="card">
        <TabPane tab="SELL" key="sell">
          {estate.status === ESTATE_STATUS.OWNED &&
            renderOwnedSellOrderForm(handleSellOrderFormSubmit)}
          {estate.status === ESTATE_STATUS.SELLING &&
            renderOwnedSellOrderInfo(estate, handleChancelSellOrder)}
          {renderOwnedBuyOfferTable(estate.buyOffers, handleBuyOfferClick)}
        </TabPane>
        <TabPane tab="BUY" key="buy">
          {estate.status === ESTATE_STATUS.BUYING &&
            renderOwnedBuyOrderTable(
              estate.buyOffers[0],
              handleChancelBuyOrder
            )}
        </TabPane>
      </Tabs>
    </EstateOrderTabWrap>
  );
};

const EstateOrderTabWrap = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: white;
`;

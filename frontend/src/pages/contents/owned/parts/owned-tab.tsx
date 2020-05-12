import {Tabs} from "antd";
import React from "react";
import styled from "styled-components";

import {User} from "~models/user";
import {renderOwnedBuyOfferTable} from "~pages/contents/owned/parts/owned-buy-offer-table";
import {renderOwnedBuyOrderTable} from "~pages/contents/owned/parts/owned-buy-order-table";
import {OwnedSellOrderForm} from "~pages/contents/owned/parts/owned-sell-order-form";
import {renderOwnedSellOrderInfo} from "~pages/contents/owned/parts/owned-sell-order-info";
import {ESTATE_STATUS, OwnedEstate} from "~src/models/estate";
import {BuyOrder, SellOrder} from "~src/models/order";

const {TabPane} = Tabs;

interface Props {
  user: User;
  estate: OwnedEstate;
  handleSellOrderFormSubmit: (values: {[key: string]: string | number}) => void;
  handleChancelSellOrder: (order: SellOrder) => () => void;
  handleChancelBuyOrder: (order: BuyOrder) => () => void;
  handleBuyOfferClick: (order: BuyOrder) => () => void;
}

export class EstateOrderTab extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      user,
      estate,
      handleBuyOfferClick,
      handleChancelBuyOrder,
      handleChancelSellOrder,
      handleSellOrderFormSubmit
    } = this.props;

    const activeSellOrder: SellOrder | null = estate.findActiveSellOrder();

    return (
      <EstateOrderTabWrap className={"card-container"}>
        <Tabs type="card">
          <TabPane tab="SELL" key="sell">
            {estate.status === ESTATE_STATUS.OWNED && (
              <OwnedSellOrderForm
                estate={estate}
                onFinish={handleSellOrderFormSubmit}
              />
            )}
            {estate.status === ESTATE_STATUS.SELLING &&
              activeSellOrder &&
              renderOwnedSellOrderInfo(
                activeSellOrder,
                handleChancelSellOrder(activeSellOrder)
              )}
            {renderOwnedBuyOfferTable(
              activeSellOrder?.buyOffers ?? [],
              handleBuyOfferClick
            )}
          </TabPane>
          <TabPane tab="BUY" key="buy">
            {estate.status === ESTATE_STATUS.BUYING &&
              activeSellOrder &&
              renderOwnedBuyOrderTable(
                estate.findActiveOwnedBuyOffer(user.address),
                handleChancelBuyOrder
              )}
          </TabPane>
        </Tabs>
      </EstateOrderTabWrap>
    );
  }
}

const EstateOrderTabWrap = styled.div`
  margin: 20px 0;
  padding: 10px;
  background-color: white;
`;

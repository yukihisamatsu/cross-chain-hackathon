import {Tabs} from "antd";
import React from "react";
import styled from "styled-components";

import {User} from "~models/user";
import {renderOwnedBuyersBuyOfferTable} from "~pages/contents/owned/parts/owned-buyers-buy-offer-table";
import {OwnedSellOrderForm} from "~pages/contents/owned/parts/owned-sell-order-form";
import {renderOwnedSellOrderInfo} from "~pages/contents/owned/parts/owned-sell-order-info";
import {renderOwnedSellersBuyOfferTable} from "~pages/contents/owned/parts/owned-sellers-buy-offer-table";
import {ESTATE_STATUS, OwnedEstate} from "~src/models/estate";
import {BuyOffer, SellOrder} from "~src/models/order";

const {TabPane} = Tabs;

interface Props {
  user: User;
  estate: OwnedEstate;
  handleSellOrderFormSubmit: (values: {[key: string]: string | number}) => void;
  handleSellersBuyOfferClick: (order: BuyOffer) => () => void;
  handleChancelSellOrder: (order: SellOrder) => () => void;
  handleChancelBuyersBuyOffer: (order: BuyOffer) => () => void;
}

export class EstateOrderTab extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  renderSellTab(activeSellOrder: SellOrder | null) {
    const {
      estate,
      user,
      handleSellersBuyOfferClick,
      handleChancelSellOrder,
      handleSellOrderFormSubmit
    } = this.props;

    return (
      <React.Fragment>
        {estate.status === ESTATE_STATUS.OWNED &&
          estate.units > 0 &&
          !activeSellOrder && (
            <OwnedSellOrderForm
              estate={estate}
              onFinish={handleSellOrderFormSubmit}
            />
          )}
        {estate.status === ESTATE_STATUS.SELLING &&
          activeSellOrder &&
          activeSellOrder.isOwner(user.address) && (
            <React.Fragment>
              {renderOwnedSellOrderInfo(
                activeSellOrder,
                handleChancelSellOrder(activeSellOrder)
              )}
              {renderOwnedSellersBuyOfferTable(
                activeSellOrder?.buyOffers
                  ? BuyOffer.sortDateDesc(activeSellOrder.buyOffers)
                  : [],
                handleSellersBuyOfferClick
              )}
            </React.Fragment>
          )}
      </React.Fragment>
    );
  }

  renderBuyTab(activeSellOrder: SellOrder | null) {
    const {estate, user, handleChancelBuyersBuyOffer} = this.props;

    return (
      estate.status === ESTATE_STATUS.BUYING &&
      activeSellOrder &&
      renderOwnedBuyersBuyOfferTable(
        estate.findOwnedBuyOffer(user.address),
        handleChancelBuyersBuyOffer
      )
    );
  }

  render() {
    const {estate} = this.props;

    const activeSellOrder: SellOrder | null = estate.findActiveSellOrder();

    return (
      <EstateOrderTabWrap className={"card-container"}>
        <Tabs
          type="card"
          defaultActiveKey={
            estate.status === ESTATE_STATUS.BUYING ? "buy" : "sell"
          }
        >
          <TabPane tab="SELL" key="sell">
            {this.renderSellTab(activeSellOrder)}
          </TabPane>
          <TabPane tab="BUY" key="buy">
            {this.renderBuyTab(activeSellOrder)}
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

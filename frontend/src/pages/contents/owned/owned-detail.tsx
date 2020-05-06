import React from "react";
import {RouteComponentProps} from "react-router-dom";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";
import {BuyOrder} from "~models/order";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {ESTATE_LIST_TYPE} from "~pages/commons/estate/estate-list";
import {OwnedBuyOfferModal} from "~pages/contents/owned/parts/owned-buy-offer-modal";
import {OwnedBuyOrderCancelModal} from "~pages/contents/owned/parts/owned-buy-order-cancel-modal";
import {renderOwnedDividendTable} from "~pages/contents/owned/parts/owned-dividend-table";
import {OwnedSellOrderCancelModal} from "~pages/contents/owned/parts/owned-sell-order-cancel-modal";
import {OwnedSellOrderModal} from "~pages/contents/owned/parts/owned-sell-order-modal";
import {renderEstateOrderTab} from "~pages/contents/owned/parts/owned-tab";
import {dummyOwnedEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";

interface Props extends Pick<RouteComponentProps, "history"> {
  id: string;
}

interface State {
  estate: OwnedEstate;
  sellOrderModalVisible: boolean;
  sellOrderModalConfirmLoading: boolean;
  unit: number;
  perUnit: number;
  selectedTradeId: number;
  cancelSellOrderModalVisible: boolean;
  cancelSellOrderModalConfirmLoading: boolean;
  canceledBuyOrder?: BuyOrder;
  cancelBuyOrderModalVisible: boolean;
  cancelBuyOrderModalConfirmLoading: boolean;
  buyOfferModalVisible: boolean;
  buyOfferModalConfirmLoading: boolean;
}

export class OwnedDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      estate: OwnedEstate.default(),
      sellOrderModalVisible: false,
      sellOrderModalConfirmLoading: false,
      cancelSellOrderModalVisible: false,
      cancelSellOrderModalConfirmLoading: false,
      cancelBuyOrderModalVisible: false,
      cancelBuyOrderModalConfirmLoading: false,
      unit: 0,
      perUnit: 0,
      selectedTradeId: 0,
      buyOfferModalVisible: false,
      buyOfferModalConfirmLoading: false
    };
  }

  componentDidMount() {
    // TODO get Estate Request & setState({estate)
    const {id, history} = this.props;
    const estate = dummyOwnedEstateList.find(e => e.tokenId === id);
    if (!estate) {
      history.push(PATHS.OWNED);
      return;
    }
    this.setState({
      estate
    });
  }

  handleSellOrderButtonClick = (values: {[key: string]: string | number}) => {
    this.setState({
      unit: values["unit"] as number,
      perUnit: values["perUnit"] as number,
      sellOrderModalVisible: true
    });
  };

  renderSellOrderModal = (estate: OwnedEstate) => {
    const {
      unit,
      perUnit,
      sellOrderModalVisible,
      sellOrderModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        unit: 0,
        perUnit: 0,
        sellOrderModalVisible: false,
        sellOrderModalConfirmLoading: false
      });
    return (
      <OwnedSellOrderModal
        estate={estate}
        unit={unit}
        perUnit={perUnit}
        visible={sellOrderModalVisible}
        confirmLoading={sellOrderModalConfirmLoading}
        onOK={() => {
          this.setState({sellOrderModalConfirmLoading: true}, () => {
            // TODO api call
            setTimeout(() => {
              resetState();
            }, 2000);
          });
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  handleCancelSellOrderButtonClick = () => {
    this.setState({
      cancelSellOrderModalVisible: true
    });
  };

  renderCancelSellOrderModal = (estate: OwnedEstate) => {
    const {
      cancelSellOrderModalVisible,
      cancelSellOrderModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        cancelSellOrderModalVisible: false,
        cancelSellOrderModalConfirmLoading: false
      });

    return (
      <OwnedSellOrderCancelModal
        estate={estate}
        visible={cancelSellOrderModalVisible}
        confirmLoading={cancelSellOrderModalConfirmLoading}
        onOK={() => {
          this.setState({cancelSellOrderModalConfirmLoading: true}, () => {
            // TODO api
            setTimeout(() => {
              resetState();
            }, 2000);
          });
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  handleCancelBuyOrderButtonClick = (buyOrder: BuyOrder) => () => {
    this.setState({
      selectedTradeId: buyOrder.tradeId,
      cancelSellOrderModalVisible: true
    });
  };

  renderCancelBuyOrderModal = (estate: OwnedEstate) => {
    const {
      canceledBuyOrder,
      cancelBuyOrderModalVisible,
      cancelBuyOrderModalConfirmLoading
    } = this.state;

    if (!canceledBuyOrder) {
      return;
    }

    const resetState = () =>
      this.setState({
        selectedTradeId: 0,
        cancelBuyOrderModalVisible: false,
        cancelBuyOrderModalConfirmLoading: false
      });

    return (
      <OwnedBuyOrderCancelModal
        estate={estate}
        order={canceledBuyOrder}
        visible={cancelBuyOrderModalVisible}
        confirmLoading={cancelBuyOrderModalConfirmLoading}
        onOK={() => {
          this.setState({cancelBuyOrderModalConfirmLoading: true}, () => {
            // TODO api
            setTimeout(() => {
              resetState();
            }, 2000);
          });
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  handleBuyOfferButtonClick = (order: BuyOrder) => () => {
    this.setState({
      selectedTradeId: order.tradeId,
      buyOfferModalVisible: true
    });
  };

  renderBuyOfferModal = (estate: OwnedEstate) => {
    const {
      selectedTradeId,
      buyOfferModalVisible,
      buyOfferModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        selectedTradeId: 0,
        buyOfferModalVisible: false,
        buyOfferModalConfirmLoading: false
      });

    return (
      <OwnedBuyOfferModal
        estate={estate}
        selectedTradeId={selectedTradeId}
        visible={buyOfferModalVisible}
        confirmLoading={buyOfferModalConfirmLoading}
        onOK={() => {
          this.setState({buyOfferModalConfirmLoading: true}, () => {
            // TODO sign & broadcastTx
            setTimeout(() => {
              resetState();
            }, 2000);
          });
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  render() {
    const {estate} = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(ESTATE_LIST_TYPE.OWNED, estate)}
        {estate.dividend.length > 0 &&
          renderOwnedDividendTable(estate.dividend)}
        {renderEstateOrderTab(
          estate,
          this.handleSellOrderButtonClick,
          this.handleCancelSellOrderButtonClick,
          this.handleCancelBuyOrderButtonClick,
          this.handleBuyOfferButtonClick
        )}
        {this.renderSellOrderModal(estate)}
        {this.renderCancelSellOrderModal(estate)}
        {this.renderCancelBuyOrderModal(estate)}
        {this.renderBuyOfferModal(estate)}
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

import {message} from "antd";
import log from "loglevel";
import React from "react";
import {RouteComponentProps} from "react-router-dom";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";
import {BuyOrder} from "~models/order";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {OwnedBuyOfferModal} from "~pages/contents/owned/parts/owned-buy-offer-modal";
import {OwnedBuyOrderCancelModal} from "~pages/contents/owned/parts/owned-buy-order-cancel-modal";
import {renderOwnedDividendTable} from "~pages/contents/owned/parts/owned-dividend-table";
import {OwnedSellOrderCancelModal} from "~pages/contents/owned/parts/owned-sell-order-cancel-modal";
import {OwnedSellOrderModal} from "~pages/contents/owned/parts/owned-sell-order-modal";
import {renderEstateOrderTab} from "~pages/contents/owned/parts/owned-tab";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {Repositories} from "~src/repos/types";

interface Props extends RouteComponentProps<{id: string}> {
  config: Config;
  repos: Repositories;
  user: User;
  setHeaderText: (headerText: string) => void;
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

  async componentDidMount() {
    await this.getEstate();
  }

  async componentDidUpdate(
    prevProps: Readonly<Props>,
    prevStates: Readonly<State>
  ) {
    if (prevProps.user.address !== this.props.user.address) {
      await this.getEstate();
    }

    if (
      prevStates.estate.tokenId !== this.state.estate.tokenId ||
      prevStates.estate.userDividend.length !==
        this.state.estate.userDividend.length ||
      prevStates.estate.buyOffers.length !==
        this.state.estate.buyOffers.length ||
      prevStates.estate.status !== this.state.estate.status
    ) {
      await this.getEstate();
    }
  }

  async getEstate() {
    const {
      repos: {estateRepo},
      user: {address},
      setHeaderText,
      match: {
        params: {id}
      },
      history
    } = this.props;

    try {
      const estate = await estateRepo.getOwnedEstate(id, address);
      setHeaderText(estate.name);
      this.setState({
        estate
      });
    } catch (e) {
      message.error(e);
      history.push(PATHS.OWNED);
    }
  }

  handleSellOrderButtonClick = (values: {[key: string]: string | number}) => {
    const unit = values["unit"] as number;
    const perUnit = values["perUnit"] as number;

    this.setState({
      unit,
      perUnit,
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
          const {
            repos: {estateRepo},
            user: {address}
          } = this.props;
          const {unit, perUnit} = this.state;
          this.setState({sellOrderModalConfirmLoading: true}, async () => {
            try {
              await estateRepo.postSellOrder(estate, unit, perUnit, address);
              resetState();
            } catch (e) {
              log.error(e);
              message.error("API Request Failed");
            }
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
        {renderEstateDetailInfo(estate)}
        {estate.userDividend.length > 0 &&
          renderOwnedDividendTable(estate.userDividend)}
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

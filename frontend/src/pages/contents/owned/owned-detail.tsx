import {message} from "antd";
import log from "loglevel";
import React from "react";
import {RouteComponentProps} from "react-router-dom";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";
import {BuyOffer, SellOrder} from "~models/order";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {OwnedBuyOfferCancelModal} from "~pages/contents/owned/parts/owned-buy-offer-cancel-modal";
import {renderOwnedDividendTable} from "~pages/contents/owned/parts/owned-dividend-table";
import {OwnedSellBuyOfferModal} from "~pages/contents/owned/parts/owned-sell-buy-offer-modal";
import {OwnedSellOrderCancelModal} from "~pages/contents/owned/parts/owned-sell-order-cancel-modal";
import {OwnedSellOrderModal} from "~pages/contents/owned/parts/owned-sell-order-modal";
import {EstateOrderTab} from "~pages/contents/owned/parts/owned-tab";
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
  canceledSellOrder?: SellOrder;
  cancelSellOrderModalVisible: boolean;
  cancelSellOrderModalConfirmLoading: boolean;
  canceledBuyOffer?: BuyOffer;
  cancelBuyersBuyOfferModalVisible: boolean;
  cancelBuyersBuyOfferModalConfirmLoading: boolean;
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
      cancelBuyersBuyOfferModalVisible: false,
      cancelBuyersBuyOfferModalConfirmLoading: false,
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
      prevStates.estate.dividend.length !== this.state.estate.dividend.length ||
      prevStates.estate.sellOrders.length !==
        this.state.estate.sellOrders.length ||
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

  renderSellOrderModal = () => {
    const {
      estate,
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
            repos: {estateRepo, orderRepo},
            user: {address}
          } = this.props;
          const {unit, perUnit} = this.state;
          this.setState({sellOrderModalConfirmLoading: true}, async () => {
            try {
              const response = await orderRepo.postSellOrder(
                estate.tokenId,
                unit,
                perUnit,
                address
              );
              log.debug(response);

              const newEstate = await estateRepo.getOwnedEstate(
                estate.tokenId,
                address
              );
              this.setState({estate: newEstate});
            } catch (e) {
              log.error(e);
              message.error("API Request Failed");
            } finally {
              resetState();
            }
          });
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  handleCancelSellOrderButtonClick = (canceledSellOrder: SellOrder) => () => {
    this.setState({
      canceledSellOrder,
      cancelSellOrderModalVisible: true
    });
  };

  renderCancelSellOrderModal = () => {
    const {
      estate,
      canceledSellOrder,
      cancelSellOrderModalVisible,
      cancelSellOrderModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        cancelSellOrderModalVisible: false,
        cancelSellOrderModalConfirmLoading: false
      });

    return (
      canceledSellOrder && (
        <OwnedSellOrderCancelModal
          estate={estate}
          sellOrder={canceledSellOrder}
          visible={cancelSellOrderModalVisible}
          confirmLoading={cancelSellOrderModalConfirmLoading}
          onOK={() => {
            this.setState(
              {cancelSellOrderModalConfirmLoading: true},
              async () => {
                const {
                  user: {address},
                  repos: {estateRepo, orderRepo}
                } = this.props;

                try {
                  await orderRepo.cancelSellOrder(canceledSellOrder);
                  const newEstate = await estateRepo.getOwnedEstate(
                    estate.tokenId,
                    address
                  );
                  this.setState({estate: newEstate});
                } catch (e) {
                  log.error(e);
                  message.error("API Request Failed");
                } finally {
                  resetState();
                }
              }
            );
          }}
          onCancel={() => {
            resetState();
          }}
        />
      )
    );
  };

  handleCancelBuyersBuyOfferButtonClick = (buyOffer: BuyOffer) => () => {
    this.setState({
      canceledBuyOffer: buyOffer,
      cancelBuyersBuyOfferModalVisible: true
    });
  };

  renderCancelBuyersBuyOfferModal = () => {
    const {
      estate,
      canceledBuyOffer,
      cancelBuyersBuyOfferModalVisible,
      cancelBuyersBuyOfferModalConfirmLoading
    } = this.state;

    if (!canceledBuyOffer) {
      return;
    }

    const resetState = () =>
      this.setState({
        selectedTradeId: 0,
        cancelBuyersBuyOfferModalVisible: false,
        cancelBuyersBuyOfferModalConfirmLoading: false
      });

    return (
      <OwnedBuyOfferCancelModal
        estate={estate}
        order={canceledBuyOffer}
        visible={cancelBuyersBuyOfferModalVisible}
        confirmLoading={cancelBuyersBuyOfferModalConfirmLoading}
        onOK={() => {
          this.setState(
            {cancelBuyersBuyOfferModalConfirmLoading: true},
            async () => {
              const {
                user: {address},
                repos: {estateRepo, orderRepo}
              } = this.props;

              try {
                const response = await orderRepo.cancelBuyOffer(
                  canceledBuyOffer
                );
                log.debug(response);

                const newEstate = await estateRepo.getOwnedEstate(
                  estate.tokenId,
                  address
                );
                this.setState({estate: newEstate});
              } catch (e) {
                log.error(e);
                message.error("API Request Failed");
              } finally {
                resetState();
              }
            }
          );
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  handleBuyOfferButtonClick = (order: BuyOffer) => () => {
    this.setState({
      selectedTradeId: order.tradeId,
      buyOfferModalVisible: true
    });
  };

  renderBuyOfferModal = () => {
    const {
      estate,
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
      <OwnedSellBuyOfferModal
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
    const {user} = this.props;
    const {estate} = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {estate.dividend.length > 0 &&
          renderOwnedDividendTable(estate.dividend)}
        <EstateOrderTab
          user={user}
          estate={estate}
          handleSellersBuyOfferClick={this.handleBuyOfferButtonClick}
          handleSellOrderFormSubmit={this.handleSellOrderButtonClick}
          handleChancelSellOrder={this.handleCancelSellOrderButtonClick}
          handleChancelBuyersBuyOffer={
            this.handleCancelBuyersBuyOfferButtonClick
          }
        />
        {this.renderSellOrderModal()}
        {this.renderBuyOfferModal()}
        {this.renderCancelSellOrderModal()}
        {this.renderCancelBuyersBuyOfferModal()}
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

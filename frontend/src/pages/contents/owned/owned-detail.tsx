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
import {StdTx} from "~src/libs/api";
import {Cosmos} from "~src/libs/cosmos/util";
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
  selectedBuyOffer?: BuyOffer;
  buyOfferModalVisible: boolean;
  buyOfferModalConfirmLoading: boolean;
  canceledSellOrder?: SellOrder;
  cancelSellOrderModalVisible: boolean;
  cancelSellOrderModalConfirmLoading: boolean;
  canceledBuyersBuyOffer?: BuyOffer;
  cancelBuyersBuyOfferModalVisible: boolean;
  cancelBuyersBuyOfferModalConfirmLoading: boolean;
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
      repos: {estateRepo, orderRepo},
      user: {address}
    } = this.props;

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
        onCancel={resetState}
      />
    );
  };

  handleBuyOfferButtonClick = (selectedBuyOffer: BuyOffer) => () => {
    this.setState({
      selectedBuyOffer,
      buyOfferModalVisible: true
    });
  };

  handleBuyOfferOKClick = (resetState: () => void) => () => {
    const {
      repos: {estateRepo, orderRepo},
      user: {address, mnemonic}
    } = this.props;

    const {estate, selectedBuyOffer} = this.state;

    this.setState({buyOfferModalConfirmLoading: true}, async () => {
      if (!selectedBuyOffer) {
        message.error("please select buy order.");
        resetState();
        return;
      }

      try {
        const crossTx = selectedBuyOffer.crossTx;
        log.debug(crossTx);

        const ecPairPriv = Cosmos.getECPairPriv(mnemonic);
        const signedTx: StdTx = Cosmos.signCrossTx(crossTx.value, ecPairPriv);
        log.debug(signedTx);

        const response = await orderRepo.broadcastTx(signedTx);
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
  };

  renderBuyOfferModal = () => {
    const {
      estate,
      selectedBuyOffer,
      buyOfferModalVisible,
      buyOfferModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        selectedBuyOffer: undefined,
        buyOfferModalVisible: false,
        buyOfferModalConfirmLoading: false
      });

    return (
      selectedBuyOffer && (
        <OwnedSellBuyOfferModal
          estate={estate}
          selectedBuyOffer={selectedBuyOffer}
          visible={buyOfferModalVisible}
          confirmLoading={buyOfferModalConfirmLoading}
          onOK={this.handleBuyOfferOKClick(resetState)}
          onCancel={resetState}
        />
      )
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
      user: {address},
      repos: {estateRepo, orderRepo}
    } = this.props;

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
          onCancel={resetState}
        />
      )
    );
  };

  handleCancelBuyersBuyOfferButtonClick = (buyOffer: BuyOffer) => () => {
    this.setState({
      canceledBuyersBuyOffer: buyOffer,
      cancelBuyersBuyOfferModalVisible: true
    });
  };

  renderCancelBuyersBuyOfferModal = () => {
    const {
      user: {address},
      repos: {estateRepo, orderRepo}
    } = this.props;

    const {
      estate,
      canceledBuyersBuyOffer,
      cancelBuyersBuyOfferModalVisible,
      cancelBuyersBuyOfferModalConfirmLoading
    } = this.state;

    if (!canceledBuyersBuyOffer) {
      return;
    }

    const resetState = () =>
      this.setState({
        canceledBuyersBuyOffer: undefined,
        cancelBuyersBuyOfferModalVisible: false,
        cancelBuyersBuyOfferModalConfirmLoading: false
      });

    return (
      <OwnedBuyOfferCancelModal
        estate={estate}
        order={canceledBuyersBuyOffer}
        visible={cancelBuyersBuyOfferModalVisible}
        confirmLoading={cancelBuyersBuyOfferModalConfirmLoading}
        onOK={() => {
          this.setState(
            {cancelBuyersBuyOfferModalConfirmLoading: true},
            async () => {
              try {
                const response = await orderRepo.cancelBuyOffer(
                  canceledBuyersBuyOffer
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
        onCancel={resetState}
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

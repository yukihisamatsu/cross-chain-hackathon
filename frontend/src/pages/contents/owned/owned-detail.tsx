import {message, Spin} from "antd";
import log from "loglevel";
import React from "react";
import {RouteComponentProps} from "react-router-dom";
import styled from "styled-components";

import {OwnedEstate} from "~models/estate";
import {BuyOffer, SellOrder} from "~models/order";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {OwnedBuyersBuyOfferCancelModal} from "~pages/contents/owned/parts/owned-buyers-buy-offer-cancel-modal";
import {renderOwnedDividendTable} from "~pages/contents/owned/parts/owned-dividend-table";
import {OwnedSellBuyOfferModal} from "~pages/contents/owned/parts/owned-sell-buy-offer-modal";
import {OwnedSellOrderCancelModal} from "~pages/contents/owned/parts/owned-sell-order-cancel-modal";
import {OwnedSellOrderModal} from "~pages/contents/owned/parts/owned-sell-order-modal";
import {EstateOrderTab} from "~pages/contents/owned/parts/owned-tab";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {Cross} from "~src/libs/cosmos/util";
import {Repositories} from "~src/repos/types";
import {HexEncodedString} from "~src/types";

interface Props extends RouteComponentProps<{id: string}> {
  config: Config;
  repos: Repositories;
  user: User;
  setUser: (user: User) => Promise<void>;
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
  isTxBroadcasting: boolean;
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
      buyOfferModalConfirmLoading: false,
      isTxBroadcasting: false
    };
  }

  getEstateTimerId = 0;
  getTxStatusTimerId = 0;
  componentWillUnmount() {
    this.getEstateTimerId !== 0 && clearTimeout(this.getEstateTimerId);
    this.getTxStatusTimerId !== 0 && clearTimeout(this.getTxStatusTimerId);
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
      prevStates.estate.dividendHistories.length !==
        this.state.estate.dividendHistories.length ||
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
      await this.getEstateTimer();
    } catch (e) {
      message.error(JSON.stringify(e));
      history.push(PATHS.OWNED);
    }
  }

  getEstateTimer = () => {
    this.getEstateTimerId !== 0 && clearTimeout(this.getEstateTimerId);
    this.getEstateTimerId = window.setTimeout(async () => {
      try {
        const {
          user: {address},
          repos: {estateRepo}
        } = this.props;
        const {estate} = this.state;

        const newEstate = await estateRepo.getOwnedEstate(
          estate.tokenId,
          address
        );
        this.setState({
          estate: newEstate
        });
      } catch (e) {
        log.error(e);
      } finally {
        await this.getEstateTimer();
      }
    }, 10000);
  };

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
      repos: {estateRepo, orderRepo, userRepo},
      user: {address, mnemonic},
      history
    } = this.props;

    const {estate, selectedBuyOffer} = this.state;

    this.setState(
      {
        buyOfferModalConfirmLoading: true,
        isTxBroadcasting: true
      },
      async () => {
        if (!selectedBuyOffer) {
          message.error("please select buy order.");
          resetState();
          return;
        }

        try {
          const crossTx = selectedBuyOffer.crossTx;
          log.debug(crossTx);

          const {
            accountNumber,
            sequence
          } = await userRepo.getAuthAccountCoordinator(address);

          const sig = Cross.signCrossTx({
            crossTx,
            accountNumber,
            sequence,
            mnemonic
          });

          crossTx.value.signatures?.unshift(sig);
          log.debug("crossTx with sign", crossTx);

          const response = await orderRepo.broadcastOrderTx(crossTx.value);
          log.debug("response", response);

          response.data &&
            (await this.getTxStatusTimer(
              response.data,
              selectedBuyOffer,
              async () => {
                const newEstate = await estateRepo.getOwnedEstate(
                  estate.tokenId,
                  address
                );
                const {user, setUser} = this.props;
                await setUser(user);

                if (newEstate.units === 0) {
                  history.push(PATHS.OWNED);
                  return;
                }

                this.setState({
                  estate: newEstate,
                  isTxBroadcasting: false,
                  selectedBuyOffer: undefined
                });
              }
            ));
        } catch (e) {
          log.error(e);
          message.error(JSON.stringify(e));
        } finally {
          resetState();
        }
      }
    );
  };

  getTxStatusTimer = async (
    txId: HexEncodedString,
    selectedBuyOffer: BuyOffer,
    onFinished: () => Promise<void>
  ) => {
    this.getTxStatusTimerId !== 0 && clearTimeout(this.getTxStatusTimerId);
    this.getTxStatusTimerId = window.setTimeout(async () => {
      try {
        const {
          user: {address},
          repos: {estateRepo, orderRepo}
        } = this.props;

        await orderRepo.getTradeTxStatus(txId);

        const newBuyOffer = await orderRepo.getBuyOffer(
          selectedBuyOffer,
          selectedBuyOffer.quantity,
          selectedBuyOffer.perUnitPrice
        );

        if (newBuyOffer.isFinished()) {
          if (newBuyOffer.isCompleted()) {
            message.info("successfully broadcast Tx");
          } else {
            message.error("failed to broadcast tx");
          }
          await onFinished();
          return;
        }

        if (
          selectedBuyOffer.status !== newBuyOffer.status &&
          newBuyOffer.isOnGoing()
        ) {
          const newEstate = await estateRepo.getOwnedEstate(
            this.state.estate.tokenId,
            address
          );
          this.setState({estate: newEstate});
        }

        await this.getTxStatusTimer(txId, newBuyOffer, onFinished);
      } catch (e) {
        log.error(e);
        await this.getTxStatusTimer(txId, selectedBuyOffer, onFinished);
      }
    }, 3000);
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
      repos: {orderRepo},
      history
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
      <OwnedBuyersBuyOfferCancelModal
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
                history.push(PATHS.OWNED);
              } catch (e) {
                log.error(e);
                message.error("API Request Failed");
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
    const {estate, isTxBroadcasting} = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {renderOwnedDividendTable(estate.filterDistributedDividendHistories())}
        <Spin spinning={isTxBroadcasting} tip="Broadcasting...">
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
        </Spin>
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

import {message} from "antd";
import log from "loglevel";
import {DateTime} from "luxon";
import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {MarketEstate} from "~models/estate";
import {SellOrder} from "~models/order";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {MarketSellOrderModal} from "~pages/contents/market/parts/market-sell-order-modal-tsx";
import {renderMarketSellOrderTable} from "~pages/contents/market/parts/market-sell-order-table";
import {PATHS} from "~pages/routes";
import {Config} from "~src/heplers/config";
import {CrossTx} from "~src/libs/api";
import {Cosmos} from "~src/libs/cosmos/util";
import {Repositories} from "~src/repos/types";

interface Props extends RouteComponentProps<{id: string}> {
  config: Config;
  repos: Repositories;
  user: User;
  setHeaderText: (headerText: string) => void;
}

interface State {
  estate: MarketEstate;
  sellOrderModalVisible: boolean;
  sellOrderModalConfirmLoading: boolean;
  selectedSellOrder?: SellOrder;
}

export class MarketDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      estate: MarketEstate.default(),
      sellOrderModalVisible: false,
      sellOrderModalConfirmLoading: false
    };
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
      prevStates.estate.sellOrders.length !==
        this.state.estate.sellOrders.length
    ) {
      await this.getEstate();
    }
  }

  async componentDidMount() {
    await this.getEstate();
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

    let estate: MarketEstate;

    try {
      estate = await estateRepo.getMarketEstate(id, address);
      setHeaderText(estate.name);
      this.setState({
        estate
      });
    } catch (e) {
      message.error(JSON.stringify(e));
      history.push(PATHS.MARKET);
      return;
    }
  }

  handleSellOrderButtonClick = (selectedSellOrder: SellOrder) => () => {
    this.setState({
      selectedSellOrder,
      sellOrderModalVisible: true
    });
  };

  renderSellOrderModal = (estate: MarketEstate) => {
    const {
      user: {address, mnemonic},
      repos: {estateRepo, orderRepo, userRepo}
    } = this.props;

    const {
      selectedSellOrder,
      sellOrderModalVisible,
      sellOrderModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        selectedSellOrder: undefined,
        sellOrderModalVisible: false,
        sellOrderModalConfirmLoading: false
      });

    return (
      selectedSellOrder && (
        <MarketSellOrderModal
          estate={estate}
          selectedSellOrder={selectedSellOrder}
          visible={sellOrderModalVisible}
          confirmLoading={sellOrderModalConfirmLoading}
          onOK={() => {
            this.setState({sellOrderModalConfirmLoading: true}, async () => {
              try {
                const crossTx: CrossTx = await orderRepo.getBuyRequestTx(
                  selectedSellOrder,
                  address
                );
                log.debug(crossTx);

                const nonce = DateTime.utc().toMillis();
                crossTx.value.msg[0].value.Nonce = nonce.toString(10);

                const {
                  accountNumber,
                  sequence
                } = await userRepo.getAuthAccountCoordinator(address);
                const sig = Cosmos.signCrossTx({
                  crossTx,
                  accountNumber,
                  sequence,
                  mnemonic
                });

                const response = await orderRepo.postBuyOffer(
                  selectedSellOrder,
                  address,
                  {
                    ...crossTx,
                    value: {
                      ...crossTx.value,
                      signatures: [sig]
                    }
                  }
                );
                log.debug(response);

                const newEstate = await estateRepo.getMarketEstate(
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
      )
    );
  };

  render() {
    const {user} = this.props;
    const {estate} = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {renderMarketSellOrderTable(
          estate.getUnOfferedSellOrders(user),
          this.handleSellOrderButtonClick
        )}
        {this.renderSellOrderModal(estate)}
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

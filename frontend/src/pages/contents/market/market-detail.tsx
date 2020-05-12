import {message} from "antd";
import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {MarketEstate} from "~models/estate";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {MarketSellOrderModal} from "~pages/contents/market/parts/market-sell-order-modal-tsx";
import {renderMarketSellOrderTable} from "~pages/contents/market/parts/market-sell-order-table";
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
  estate: MarketEstate;
  sellOrderModalVisible: boolean;
  sellOrderModalConfirmLoading: boolean;
  selectedOwner: string;
}

export class MarketDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      estate: MarketEstate.default(),
      selectedOwner: "",
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
      message.error(e);
      history.push(PATHS.MARKET);
      return;
    }
  }

  handleSellOrderButtonClick = (selectedOwner: string) => () => {
    this.setState({
      selectedOwner,
      sellOrderModalVisible: true
    });
  };

  renderSellOrderModal = (estate: MarketEstate) => {
    const {
      selectedOwner,
      sellOrderModalVisible,
      sellOrderModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        selectedOwner: "",
        sellOrderModalVisible: false,
        sellOrderModalConfirmLoading: false
      });

    return (
      <MarketSellOrderModal
        estate={estate}
        selectedOwner={selectedOwner}
        visible={sellOrderModalVisible}
        confirmLoading={sellOrderModalConfirmLoading}
        onOK={() => {
          this.setState({sellOrderModalConfirmLoading: true}, () => {
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
        {renderMarketSellOrderTable(
          estate.getUnFinishedSellOrders(),
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

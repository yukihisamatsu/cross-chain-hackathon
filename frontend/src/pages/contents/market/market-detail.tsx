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

  async componentDidMount() {
    const {
      repos,
      user,
      setHeaderText,
      match: {
        params: {id}
      },
      history
    } = this.props;

    let estate: MarketEstate;

    try {
      estate = await repos.estateRepo.getMarketEstate(id, user.address);
    } catch (e) {
      history.push(PATHS.MARKET);
      return;
    }

    setHeaderText(estate.name);
    this.setState({
      estate
    });
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
          estate.sellOrders.filter(e => !e.isFinished()),
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

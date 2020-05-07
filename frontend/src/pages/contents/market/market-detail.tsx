import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {MarketEstate} from "~models/estate";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {ESTATE_LIST_TYPE} from "~pages/commons/estate/estate-list";
import {MarketSellOrderModal} from "~pages/contents/market/parts/market-sell-order-modal-tsx";
import {renderMarketSellOrderTable} from "~pages/contents/market/parts/market-sell-order-table";
import {dummyMarketEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";

type Props = RouteComponentProps<{id: string}>;

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

  componentDidMount() {
    // TODO get Estate Request & setState({estate)
    const {
      match: {
        params: {id}
      },
      history
    } = this.props;
    const estate = dummyMarketEstateList.find(e => e.tokenId === id);
    if (!estate) {
      history.push(PATHS.MARKET);
      return;
    }
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
        {renderEstateDetailInfo(ESTATE_LIST_TYPE.MARKET, estate)}
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

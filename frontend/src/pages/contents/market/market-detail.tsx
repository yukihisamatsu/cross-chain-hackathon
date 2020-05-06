import React from "react";
import styled from "styled-components";

import {MarketEstate} from "~models/estate";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {ESTATE_LIST_TYPE} from "~pages/commons/estate/estate-list";
import {MarketSellOrderModal} from "~pages/contents/market/parts/market-sell-order-modal-tsx";
import {renderMarketSellOrderTable} from "~pages/contents/market/parts/market-sell-order-table";
import {dummyMarketEstateList} from "~pages/dummy-var";

interface Props {
  id: string;
}

interface State {
  sellOrderModalVisible: boolean;
  sellOrderModalConfirmLoading: boolean;
  selectedOwner: string;
}

export class MarketDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedOwner: "",
      sellOrderModalVisible: false,
      sellOrderModalConfirmLoading: false
    };
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
              this.setState({
                selectedOwner: "",
                sellOrderModalVisible: false,
                sellOrderModalConfirmLoading: false
              });
            }, 2000);
          });
        }}
        onCancel={() => {
          this.setState({
            selectedOwner: "",
            sellOrderModalVisible: false,
            sellOrderModalConfirmLoading: false
          });
        }}
      />
    );
  };

  render() {
    const {id} = this.props;
    const estate = dummyMarketEstateList.find(e => e.tokenId === id);
    return estate ? (
      <EstateDetailWrap>
        {renderEstateDetailInfo(ESTATE_LIST_TYPE.MARKET, estate)}
        {renderMarketSellOrderTable(
          estate.sellOrders.filter(e => !e.isFinished()),
          this.handleSellOrderButtonClick
        )}
        {this.renderSellOrderModal(estate)}
      </EstateDetailWrap>
    ) : (
      <div>
        <div>Id: {id}</div>
        <div>estate not found</div>
      </div>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {IssuerDividendHistory} from "~models/dividend";
import {IssuerEstate} from "~models/estate";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {ESTATE_LIST_TYPE} from "~pages/commons/estate/estate-list";
import {IssueDividendDistributeModal} from "~pages/contents/issue/parts/issue-diviend-distributed-modal";
import {renderIssueDividendHistoryTable} from "~pages/contents/issue/parts/issue-diviend-history-table";
import {renderIssueDividendOwnerTable} from "~pages/contents/issue/parts/issue-diviend-owner-table";
import {dummyIssuerEstateList} from "~pages/dummy-var";
import {PATHS} from "~pages/routes";

type Props = RouteComponentProps<{id: string}>;

interface State {
  estate: IssuerEstate;
  selectedHistory: IssuerDividendHistory;
  distributedModalVisible: boolean;
  distributedModalConfirmLoading: boolean;
}

export class IssueDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      estate: IssuerEstate.default(),
      selectedHistory: IssuerDividendHistory.default(),
      distributedModalVisible: false,
      distributedModalConfirmLoading: false
    };
  }

  componentDidMount() {
    const {
      match: {
        params: {id}
      },
      history
    } = this.props;
    // TODO get Estate Request & setState({estate)
    const estate = dummyIssuerEstateList.find(e => e.tokenId === id);
    if (!estate) {
      history.push(PATHS.MARKET);
      return;
    }
    this.setState({
      estate
    });
  }

  handleDistributeDividendButtonClick = (
    history: IssuerDividendHistory
  ) => () => {
    this.setState({
      selectedHistory: history,
      distributedModalVisible: true
    });
  };

  renderDistributeDividendModal = () => {
    const {
      selectedHistory,
      distributedModalVisible,
      distributedModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        selectedHistory: IssuerDividendHistory.default(),
        distributedModalVisible: false,
        distributedModalConfirmLoading: false
      });

    return (
      <IssueDividendDistributeModal
        history={selectedHistory}
        visible={distributedModalVisible}
        confirmLoading={distributedModalConfirmLoading}
        onOK={() => {
          this.setState({distributedModalConfirmLoading: true}, () => {
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
        {renderEstateDetailInfo(ESTATE_LIST_TYPE.ISSUE, estate)}
        {renderIssueDividendOwnerTable(estate.issuerDividend)}
        {renderIssueDividendHistoryTable(
          estate.histories,
          this.handleDistributeDividendButtonClick
        )}
        {this.renderDistributeDividendModal()}
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

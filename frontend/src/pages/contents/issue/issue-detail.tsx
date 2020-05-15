import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {DividendHistory} from "~models/dividend";
import {IssuerEstate} from "~models/estate";
import {User} from "~models/user";
import {renderEstateDetailInfo} from "~pages/commons/estate/estate-detail-info";
import {IssueDividendDistributeModal} from "~pages/contents/issue/parts/issue-diviend-distributed-modal";
import {renderIssueDividendHistoryTable} from "~pages/contents/issue/parts/issue-diviend-history-table";
import {renderIssueDividendOwnerTable} from "~pages/contents/issue/parts/issue-diviend-owner-table";
import {renderDividendRegisterForm} from "~pages/contents/issue/parts/issue-diviend-register-form";
import {IssueDividendRegisterModal} from "~pages/contents/issue/parts/issue-diviend-register-modal";
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
  estate: IssuerEstate;
  registeredPerUnit: number;
  registeredQuantity: number;
  registeredTotal: number;
  registerModalVisible: boolean;
  registerModalConfirmLoading: boolean;
  selectedHistory: DividendHistory;
  distributedModalVisible: boolean;
  distributedModalConfirmLoading: boolean;
}

export class IssueDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      estate: IssuerEstate.default(),
      registeredPerUnit: 0,
      registeredQuantity: 0,
      registeredTotal: 0,
      registerModalVisible: false,
      registerModalConfirmLoading: false,
      selectedHistory: DividendHistory.default(),
      distributedModalVisible: false,
      distributedModalConfirmLoading: false
    };
  }

  componentDidMount() {
    const {
      setHeaderText,
      // match: {
      //   params: {id}
      // },
      history
    } = this.props;
    // TODO get Estate Request & setState({estate)
    const estate = IssuerEstate.default();
    if (!estate) {
      history.push(PATHS.MARKET);
      return;
    }
    setHeaderText(estate.name);
    this.setState({
      estate,
      registeredQuantity: 10000
    });
  }

  handleDistributeDividendButtonClick = (history: DividendHistory) => () => {
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
        selectedHistory: DividendHistory.default(),
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

  handleRegisterDividendButtonClick = () => {
    this.setState({
      registerModalVisible: true
    });
  };

  handleOnChangeRegisterPerUnit = (v: number | undefined) => {
    const {registeredQuantity} = this.state;
    if (v) {
      this.setState({
        registeredPerUnit: v,
        registeredTotal: v * registeredQuantity
      });
    }
  };

  renderRegisterDividendModal = () => {
    const {
      estate,
      registeredPerUnit,
      registeredQuantity,
      registeredTotal,
      registerModalVisible,
      registerModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        registerModalVisible: false,
        registerModalConfirmLoading: false
      });

    return (
      <IssueDividendRegisterModal
        estate={estate}
        perUnit={registeredPerUnit}
        quantity={registeredQuantity}
        total={registeredTotal}
        visible={registerModalVisible}
        confirmLoading={registerModalConfirmLoading}
        onOK={() => {
          this.setState({registerModalConfirmLoading: true}, () => {
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
    const {
      estate,
      registeredPerUnit,
      registeredQuantity,
      registeredTotal
    } = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {renderIssueDividendOwnerTable(estate.issuerDividend)}
        {renderDividendRegisterForm(
          registeredPerUnit,
          registeredQuantity,
          registeredTotal,
          this.handleOnChangeRegisterPerUnit,
          this.handleRegisterDividendButtonClick
        )}
        {renderIssueDividendHistoryTable(
          estate.histories,
          this.handleDistributeDividendButtonClick
        )}
        {this.renderDistributeDividendModal()}
        {this.renderRegisterDividendModal()}
      </EstateDetailWrap>
    );
  }
}

const EstateDetailWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

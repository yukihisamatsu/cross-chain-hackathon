import {message} from "antd";
import log from "loglevel";
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
import {encodeContractCallInfo} from "~src/libs/cosmos/Amino";
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

  async componentDidUpdate(
    prevProps: Readonly<Props>,
    prevStates: Readonly<State>
  ) {
    if (prevProps.user.address !== this.props.user.address) {
      await this.getEstate();
    }

    if (
      prevStates.estate.tokenId !== this.state.estate.tokenId ||
      prevStates.estate.histories.length !==
        this.state.estate.histories.length ||
      prevStates.estate.owners.length !== this.state.estate.owners.length ||
      prevStates.estate.issuerDividend.length !==
        this.state.estate.issuerDividend.length
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

    let estate: IssuerEstate;

    try {
      estate = await estateRepo.getIssuerEstate(id, address);
      setHeaderText(estate.name);
      this.setState({
        estate,
        registeredQuantity: estate.owners.reduce(
          (acc, owner) => acc + owner.balance,
          0
        )
      });
    } catch (e) {
      message.error(e);
      history.push(PATHS.MARKET);
      return;
    }
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
            // TODO sign & broadcastCrossTx
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

  handleRegisterDividendModalOk = (resetState: () => void) => async () => {
    const {
      user: {address},
      repos: {dividendRepo}
    } = this.props;

    const {estate, registeredPerUnit} = this.state;

    try {
      // const simulated = await dividendRepo.simulateRegisterDividend(
      //   address,
      //   estate.tokenId,
      //   registeredPerUnit
      // );
      // log.debug(simulated);

      const callContractParams = dividendRepo.getRegisterDividendParams(
        address,
        estate.tokenId,
        registeredPerUnit
      );
      const buf = Buffer.from(
        JSON.stringify({
          type: "contract/ContractCallInfo",
          value: callContractParams.call_info
        }),
        "utf8"
      );

      const contractBuf = encodeContractCallInfo(buf, true);
      log.debug(Buffer.from(contractBuf).toString("base64"));

      const registeredDividend = await dividendRepo.getDividend(
        address,
        estate.tokenId
      );
      log.debug(
        "registeredDividend",
        registeredDividend.result.return_value.toNumber()
      );

      const registeredDividendIndex = await dividendRepo.getDividendIndex(
        address,
        estate.tokenId
      );
      log.debug(
        "registeredDividendIndex",
        registeredDividendIndex.result.return_value.toNumber()
      );

      const events = await dividendRepo.getDividendRegisteredList(
        estate.tokenId
      );
      log.debug(events);
    } catch (e) {
      log.error(e);
      message.error(e);
    } finally {
      resetState();
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
          this.setState(
            {registerModalConfirmLoading: true},
            this.handleRegisterDividendModalOk(resetState)
          );
        }}
        onCancel={() => {
          resetState();
        }}
      />
    );
  };

  render() {
    const {user} = this.props;
    const {
      estate,
      registeredPerUnit,
      registeredQuantity,
      registeredTotal
    } = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {renderIssueDividendOwnerTable(estate.owners)}
        {renderDividendRegisterForm(
          user,
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

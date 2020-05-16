import {message} from "antd";
import log from "loglevel";
import {DateTime} from "luxon";
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
import {
  ContractCallMsg,
  Cosmos,
  SECURITY_CHAIN_ID
} from "~src/libs/cosmos/util";
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
      prevStates.estate.owners.length !== this.state.estate.owners.length
    ) {
      await this.getEstate();
    }
  }

  async componentDidMount() {
    const {
      repos: {dividendRepo},
      user: {address}
    } = this.props;

    await this.getEstate();

    const {
      estate: {tokenId}
    } = this.state;

    const dividend = await dividendRepo.getDividend(address, tokenId);
    log.debug("dividend", dividend.result.return_value.toNumber());

    const dividendIndex = await dividendRepo.getDividendIndex(address, tokenId);
    log.debug("dividendIndex", dividendIndex.result.return_value.toNumber());
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
      user: {address, mnemonic},
      repos: {dividendRepo, userRepo}
    } = this.props;

    const {estate, registeredPerUnit} = this.state;

    try {
      const contractCallParams = dividendRepo.getRegisterDividendParams(
        address,
        estate.tokenId,
        registeredPerUnit
      );
      const contractCallInfoBase64 = Cosmos.createContractCallInfoBase64(
        contractCallParams.call_info
      );

      const msg: ContractCallMsg = {
        type: "contract/MsgContractCall",
        value: {
          sender: address,
          signers: null,
          contract: contractCallInfoBase64
        }
      };

      const {accountNumber, sequence} = await userRepo.getAuthAccountSecurity(
        address
      );
      const fee = {amount: [], gas: "200000"};
      const memo = "";
      log.debug("accountNumber", accountNumber);
      log.debug("sequence", sequence);

      const sig = Cosmos.signContractCallTx({
        contractCallTxs: [msg],
        chainId: SECURITY_CHAIN_ID,
        accountNumber,
        sequence,
        fee,
        memo,
        mnemonic
      });

      const response = await dividendRepo.broadcastRegisterTx({
        msg: [msg],
        memo,
        fee,
        signatures: [sig]
      });
      log.debug("txResult", response);
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

  handleDistributeDividendButtonClick = (history: DividendHistory) => () => {
    this.setState({
      selectedHistory: history,
      distributedModalVisible: true
    });
  };

  handleDistributeDividendModalOk = (resetState: () => void) => async () => {
    const {
      user: {address, mnemonic},
      repos: {dividendRepo, userRepo}
    } = this.props;

    const {estate, selectedHistory} = this.state;

    try {
      const crossTx = await dividendRepo.getDistributedDividendTx(
        estate.tokenId,
        selectedHistory.perUnit
      );

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
      log.debug("sig", sig);

      crossTx.value.signatures = [sig];

      log.debug("crossTx with sign", crossTx);
      const response = await dividendRepo.broadcastDistributeTx(crossTx.value);
      log.debug(response);
    } catch (e) {
      log.error(e);
      message.error(e);
    } finally {
      resetState();
    }
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
          this.setState(
            {distributedModalConfirmLoading: true},
            this.handleDistributeDividendModalOk(resetState)
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
        {!estate.isRegistering() &&
          renderDividendRegisterForm(
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
        {this.renderRegisterDividendModal()}
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

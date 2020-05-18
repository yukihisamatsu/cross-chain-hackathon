import {message, Spin} from "antd";
import log from "loglevel";
import {DateTime} from "luxon";
import React from "react";
import {RouteComponentProps} from "react-router";
import styled from "styled-components";

import {DIVIDEND_HISTORY_STATUS, DividendHistory} from "~models/dividend";
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
  CROSS_COORDINATOR_RESULT,
  SECURITY_CHAIN_ID
} from "~src/libs/cosmos/consts";
import {ContractCallMsg, Cosmos, Cross} from "~src/libs/cosmos/util";
import {Repositories} from "~src/repos/types";
import {HexEncodedString} from "~src/types";

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
  isTxBroadcasting: boolean;
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
      distributedModalConfirmLoading: false,
      isTxBroadcasting: false
    };
  }

  timeOutId = 0;
  componentWillUnmount() {
    this.timeOutId !== 0 && clearTimeout(this.timeOutId);
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
      log.error(e);
      message.error(JSON.stringify(e));
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
      repos: {dividendRepo, estateRepo, userRepo}
    } = this.props;

    const {estate, registeredPerUnit} = this.state;

    this.setState(
      {
        registerModalConfirmLoading: true,
        isTxBroadcasting: true
      },
      async () => {
        try {
          const beforeDividendIndex = (
            await dividendRepo.getDividendIndex(address, estate.tokenId)
          ).result.return_value.toNumber();

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

          const {
            accountNumber,
            sequence
          } = await userRepo.getAuthAccountSecurity(address);
          const fee = {amount: [], gas: "1000000"};
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
          log.debug("response", response);

          await this.registerTxStatusTimer(beforeDividendIndex, async () => {
            message.info("successfully broadcast Tx");
            const newEstate = await estateRepo.getIssuerEstate(
              estate.tokenId,
              address
            );
            this.setState({
              estate: newEstate,
              selectedHistory: DividendHistory.default(),
              isTxBroadcasting: false
            });
          });
        } catch (e) {
          log.error(e);
          message.error(JSON.stringify(e));
        } finally {
          resetState();
        }
      }
    );
  };

  registerTxStatusTimer = async (
    beforeDividendIndex: number,
    onSuccess: () => Promise<void> | void
  ) => {
    this.timeOutId !== 0 && clearTimeout(this.timeOutId);
    this.timeOutId = window.setTimeout(async () => {
      try {
        const {
          user: {address},
          repos: {dividendRepo}
        } = this.props;
        const {estate} = this.state;

        const dividendIndex = await dividendRepo.getDividendIndex(
          address,
          estate.tokenId
        );
        log.debug("beforeDividendIndex", beforeDividendIndex);
        log.debug(
          "dividendIndex",
          dividendIndex.result.return_value.toNumber()
        );

        if (dividendIndex.result.return_value.gtn(beforeDividendIndex)) {
          await onSuccess();
          return;
        }

        await this.registerTxStatusTimer(beforeDividendIndex, onSuccess);
      } catch (e) {
        log.error(e);
        await this.registerTxStatusTimer(beforeDividendIndex, onSuccess);
      }
    }, 3000);
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
        onOK={this.handleRegisterDividendModalOk(resetState)}
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
      repos: {dividendRepo, estateRepo, userRepo}
    } = this.props;

    const {estate, selectedHistory} = this.state;

    this.setState(
      {
        distributedModalConfirmLoading: true,
        isTxBroadcasting: true
      },
      async () => {
        try {
          const crossTx = await dividendRepo.getDistributedDividendTx(
            estate.tokenId,
            selectedHistory.perUnit
          );

          crossTx.value.msg = await Promise.all(
            crossTx.value.msg.map(async m => {
              await new Promise(resolve => setTimeout(resolve, 1));
              return {
                ...m,
                value: {
                  ...m.value,
                  Nonce: DateTime.utc().toMillis().toString()
                }
              };
            })
          );

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

          crossTx.value.signatures = [sig];
          log.debug("crossTx with sign", crossTx);

          const response = await dividendRepo.broadcastDistributeTx(
            crossTx.value
          );
          log.debug(response);
          estate.histories = estate.histories.map(history => {
            if (history.isRegistering()) {
              history.status = DIVIDEND_HISTORY_STATUS.ONGOING;
            }
            return history;
          });
          this.setState({
            estate
          });

          response.data &&
            (await this.distributeTxStatusTimer(
              response.data,
              async () => {
                message.info("successfully broadcast Tx");
                const newEstate = await estateRepo.getIssuerEstate(
                  estate.tokenId,
                  address
                );
                this.setState({
                  estate: newEstate,
                  selectedHistory: DividendHistory.default(),
                  isTxBroadcasting: false
                });
              },
              errorMessage => {
                log.error(errorMessage);
                message.error("failed to broadcast tx");
                estate.histories = estate.histories.map(history => {
                  if (history.isRegistering()) {
                    history.status = DIVIDEND_HISTORY_STATUS.REGISTERED;
                  }
                  return history;
                });
                this.setState({
                  estate,
                  isTxBroadcasting: false
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

  distributeTxStatusTimer = async (
    txId: HexEncodedString,
    onSuccess: () => Promise<void>,
    onFailure: (errorMessage: string) => void
  ) => {
    this.timeOutId !== 0 && clearTimeout(this.timeOutId);
    this.timeOutId = window.setTimeout(async () => {
      try {
        const {
          repos: {dividendRepo}
        } = this.props;

        const status = await dividendRepo.getDistributeTxStatus(txId);
        const result = Cross.getCoordinatorStatus(status);

        if (result === CROSS_COORDINATOR_RESULT.OK) {
          await onSuccess();
          return;
        } else if (result === CROSS_COORDINATOR_RESULT.FAILED) {
          onFailure(JSON.stringify(status));
          return;
        }

        await this.distributeTxStatusTimer(txId, onSuccess, onFailure);
      } catch (e) {
        log.error(e);
        await this.distributeTxStatusTimer(txId, onSuccess, onFailure);
      }
    }, 3000);
  };

  renderDistributeDividendModal = () => {
    const {
      selectedHistory,
      distributedModalVisible,
      distributedModalConfirmLoading
    } = this.state;

    const resetState = () =>
      this.setState({
        registeredPerUnit: 0,
        registeredTotal: 0,
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
      registeredTotal,
      isTxBroadcasting
    } = this.state;
    return (
      <EstateDetailWrap>
        {renderEstateDetailInfo(estate)}
        {renderIssueDividendOwnerTable(estate.owners)}
        <Spin spinning={isTxBroadcasting} tip="Broadcasting...">
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

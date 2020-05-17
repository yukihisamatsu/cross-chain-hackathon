import {CrossTx, DividendApi, EstateApi, StdTx, TxApi} from "~src/libs/api";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {
  CrossContractCallResponse,
  CrossCoordinatorStatusResponse,
  RestClient
} from "~src/libs/cosmos/rest-client";
import {ContractCallStdTx} from "~src/libs/cosmos/util";
import {BaseRepo} from "~src/repos/base";
import {Address, HexEncodedString} from "~src/types";

export class DividendRepository extends BaseRepo {
  estateApi: EstateApi;
  dividendApi: DividendApi;
  txApi: TxApi;
  estateContract: EstateContract;
  coordinatorRestClient: RestClient;
  securityRestClient: RestClient;

  constructor({
    estateApi,
    dividendApi,
    txApi,
    estateContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    estateApi: EstateApi;
    dividendApi: DividendApi;
    txApi: TxApi;
    estateContract: EstateContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }) {
    super();
    this.estateApi = estateApi;
    this.dividendApi = dividendApi;
    this.txApi = txApi;
    this.estateContract = estateContract;
    this.coordinatorRestClient = coordinatorRestClient;
    this.securityRestClient = securityRestClient;
  }

  static create({
    estateApi,
    dividendApi,
    txApi,
    estateContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    estateApi: EstateApi;
    dividendApi: DividendApi;
    txApi: TxApi;
    estateContract: EstateContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }): DividendRepository {
    return new DividendRepository({
      estateApi,
      dividendApi,
      txApi,
      estateContract,
      coordinatorRestClient,
      securityRestClient
    });
  }

  simulateRegisterDividend(
    from: Address,
    tokenId: string,
    perShare: number
  ): Promise<CrossContractCallResponse> {
    return this.estateContract.registerDividend(from, tokenId, perShare);
  }

  getRegisterDividendParams(from: Address, tokenId: string, perShare: number) {
    return this.estateContract.registerDividendParams(from, tokenId, perShare);
  }

  async getDividend(from: Address, tokenId: string) {
    const {height, result} = await this.estateContract.dividendOf(
      from,
      tokenId
    );

    return {
      height,
      result: {
        ...result,
        return_value: this.getReturnedUint64(result)
      }
    };
  }

  async getDividendIndex(from: Address, tokenId: string) {
    const {height, result} = await this.estateContract.dividendIndexOf(
      from,
      tokenId
    );

    return {
      height,
      result: {
        ...result,
        return_value: this.getReturnedUint64(result)
      }
    };
  }

  getDividendRegisteredList(tokenId: string) {
    return this.securityRestClient.txs({
      "DividendRegistered.tokenID": tokenId
    });
  }

  getDividendDistributedList(tokenId: string) {
    return this.securityRestClient.txs({
      "DividendPaid.tokenID": tokenId
    });
  }

  getDistributedDividendTx = (
    tokenId: string,
    perShare: number
  ): Promise<CrossTx> => {
    return this.apiRequest(() => {
      return this.txApi.getTxDividend(tokenId, perShare);
    });
  };

  getDistributeTxStatus = (
    txId: HexEncodedString
  ): Promise<CrossCoordinatorStatusResponse> => {
    return this.getCrossCoordinatorStatus(this.coordinatorRestClient, txId);
  };

  broadcastRegisterTx = (
    stdTx: ContractCallStdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    return this.broadcastTx(this.securityRestClient, stdTx, mode);
  };

  broadcastDistributeTx = (
    stdTx: StdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    return this.broadcastTx(this.coordinatorRestClient, stdTx, mode);
  };
}

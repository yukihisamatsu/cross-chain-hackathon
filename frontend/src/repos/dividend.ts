import {DividendApi, EstateApi} from "~src/libs/api";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {
  CrossContractCallResponse,
  RestClient
} from "~src/libs/cosmos/rest-client";
import {ContractCallStdTx} from "~src/libs/cosmos/util";
import {BaseRepo} from "~src/repos/base";
import {Address} from "~src/types";

export class DividendRepository extends BaseRepo {
  estateApi: EstateApi;
  dividendApi: DividendApi;
  estateContract: EstateContract;
  securityRestClient: RestClient;

  constructor({
    estateApi,
    dividendApi,
    estateContract,
    securityRestClient
  }: {
    estateApi: EstateApi;
    dividendApi: DividendApi;
    estateContract: EstateContract;
    securityRestClient: RestClient;
  }) {
    super();
    this.estateApi = estateApi;
    this.dividendApi = dividendApi;
    this.estateContract = estateContract;
    this.securityRestClient = securityRestClient;
  }

  static create({
    estateApi,
    dividendApi,
    estateContract,
    securityRestClient
  }: {
    estateApi: EstateApi;
    dividendApi: DividendApi;
    estateContract: EstateContract;
    securityRestClient: RestClient;
  }): DividendRepository {
    return new DividendRepository({
      estateApi,
      dividendApi,
      estateContract,
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

  broadcastContractCallTx = async (
    stdTx: ContractCallStdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    const response = await this.securityRestClient.txsPost({
      tx: stdTx,
      mode
    });
    if (response.error || response.code || response.codespace) {
      throw new Error(JSON.stringify(response));
    }
    return response;
  };
}

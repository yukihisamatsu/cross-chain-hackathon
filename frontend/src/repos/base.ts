import {AxiosResponse} from "axios";
import BN from "bn.js";

import {StdTx} from "~src/libs/api";
import {ContractCallResponse, RestClient} from "~src/libs/cosmos/rest-client";
import {ContractCallStdTx} from "~src/libs/cosmos/util";

export abstract class BaseRepo {
  apiRequest = async <T>(
    promise: () => Promise<AxiosResponse<T>>
  ): Promise<T> => {
    const response = await promise();
    if (response.status !== 200) {
      throw new Error(`response: ${response}`);
    }
    return response.data;
  };

  broadcastTx = (
    restClient: RestClient,
    stdTx: ContractCallStdTx | StdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    return restClient.txsPost({
      tx: stdTx,
      mode
    });
  };

  getCrossCoordinatorStatus = async (
    restClient: RestClient,
    txHash: string
  ) => {
    const response = await restClient.crossCoordinatorStatus(txHash)();
    if (response.error) {
      throw new Error(JSON.stringify(response));
    }
    return response;
  };

  getReturnedUint64 = ({return_value}: ContractCallResponse) => {
    const buf = Buffer.from(return_value, "base64");
    return new BN(buf);
  };
}

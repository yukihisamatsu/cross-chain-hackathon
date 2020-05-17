import {AxiosResponse} from "axios";
import BN from "bn.js";
import log from "loglevel";

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

  getCrossCoordinatorStatus = async (restClient: RestClient, txId: string) => {
    const response = await restClient.crossCoordinatorStatus(txId)();
    if (response.error) {
      throw new Error(JSON.stringify(response));
    }
    log.debug("completed", response.result.completed);
    log.debug("status", response.result.coordinator_info.Status);
    log.debug("decision", response.result.coordinator_info.Decision);

    return response;
  };

  getReturnedUint64 = ({return_value}: ContractCallResponse) => {
    const buf = Buffer.from(return_value, "base64");
    return new BN(buf);
  };
}

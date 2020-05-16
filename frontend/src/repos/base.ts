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

  broadcastTx = async (
    restClient: RestClient,
    stdTx: ContractCallStdTx | StdTx,
    mode: "block" | "sync" | "async" = "block"
  ) => {
    const response = await restClient.txsPost({
      tx: stdTx,
      mode
    });
    if (response.error || response.code || response.codespace) {
      throw new Error(JSON.stringify(response));
    }
    return response;
  };

  getReturnedUint64 = ({return_value}: ContractCallResponse) => {
    const buf = Buffer.from(return_value, "base64");
    return new BN(buf);
  };
}

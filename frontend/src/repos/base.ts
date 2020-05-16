import {AxiosResponse} from "axios";
import BN from "bn.js";

import {ContractCallResponse} from "~src/libs/cosmos/rest-client";

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

  getReturnedUint64 = ({return_value}: ContractCallResponse) => {
    const buf = Buffer.from(return_value, "base64");
    return new BN(buf);
  };
}

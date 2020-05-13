import BN from "bn.js";

import {
  CrossContractCallParams,
  RestClient
} from "~src/libs/cosmos/rest-client";
import {Address} from "~src/types";

export class CoinContract {
  coinRestClient: RestClient;

  constructor({coinRestClient}: {coinRestClient: RestClient}) {
    this.coinRestClient = coinRestClient;
  }

  async balanceOf(owner: Address): Promise<BN> {
    const from = Buffer.from(owner, "utf-8").toString("base64");
    const params: CrossContractCallParams = {
      from: owner,
      signers: [],
      call_info: {
        id: "dcc",
        method: "balanceOf",
        args: [from]
      }
    };
    const response = await this.coinRestClient.crossContractCall(params);
    return new BN(Buffer.from(response.result.return_value, "base64"));
  }
}

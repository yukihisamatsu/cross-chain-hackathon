import BN from "bn.js";

import {
  CrossContractCallParams,
  RestClient
} from "~src/libs/cosmos/rest-client";
import {Address} from "~src/types";

export class EstateContract {
  securityRestClient: RestClient;

  constructor({securityRestClient}: {securityRestClient: RestClient}) {
    this.securityRestClient = securityRestClient;
  }

  async balanceOf(
    owner: Address,
    tokenId: number | string | number[] | Uint8Array | Buffer | BN
  ): Promise<BN> {
    const from = Buffer.from(owner, "utf-8").toString("base64");
    const tokenIdBase64 = new BN(tokenId)
      .toArrayLike(Buffer, "be", 8)
      .toString("base64");
    const params: CrossContractCallParams = {
      from: owner,
      signers: [],
      call_info: {
        id: "estate",
        method: "balanceOf",
        args: [from, tokenIdBase64]
      }
    };
    const response = await this.securityRestClient.crossContractCall(params);
    return new BN(Buffer.from(response.result.return_value, "base64"));
  }
}

import BN from "bn.js";

import {fromUTF8ToBase64} from "~src/heplers/util";
import {
  CrossContractCallParams,
  CrossContractCallResponse,
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
    const from = fromUTF8ToBase64(owner);
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

  registerDividendParams(
    from: Address,
    tokenId: number | string | number[] | Uint8Array | Buffer | BN,
    perShare: number | string | number[] | Uint8Array | Buffer | BN
  ) {
    const tokenIdBase64 = new BN(tokenId)
      .toArrayLike(Buffer, "be", 8)
      .toString("base64");

    const perShareBase64 = new BN(perShare)
      .toArrayLike(Buffer, "be", 8)
      .toString("base64");

    const params: CrossContractCallParams = {
      from,
      signers: [from],
      call_info: {
        id: "estate",
        method: "registerDividend",
        args: [tokenIdBase64, perShareBase64]
      }
    };

    return params;
  }

  async registerDividend(
    from: Address,
    tokenId: number | string | number[] | Uint8Array | Buffer | BN,
    perShare: number | string | number[] | Uint8Array | Buffer | BN
  ): Promise<CrossContractCallResponse> {
    const params = this.registerDividendParams(from, tokenId, perShare);
    return this.securityRestClient.crossContractCall(params);
  }

  dividendOf(
    from: Address,
    tokenId: number | string | number[] | Uint8Array | Buffer | BN
  ): Promise<CrossContractCallResponse> {
    const tokenIdBase64 = new BN(tokenId)
      .toArrayLike(Buffer, "be", 8)
      .toString("base64");

    const params: CrossContractCallParams = {
      from: from,
      signers: [],
      call_info: {
        id: "estate",
        method: "dividendOf",
        args: [fromUTF8ToBase64(from), tokenIdBase64]
      }
    };

    return this.securityRestClient.crossContractCall(params);
  }

  dividendIndexOf(
    from: Address,
    tokenId: number | string | number[] | Uint8Array | Buffer | BN
  ): Promise<CrossContractCallResponse> {
    const tokenIdBase64 = new BN(tokenId)
      .toArrayLike(Buffer, "be", 8)
      .toString("base64");

    const params: CrossContractCallParams = {
      from: from,
      signers: [],
      call_info: {
        id: "estate",
        method: "dividendIndexOf",
        args: [tokenIdBase64]
      }
    };

    return this.securityRestClient.crossContractCall(params);
  }
}

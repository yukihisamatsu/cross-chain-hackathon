import fetch from "cross-fetch";
import {stringify} from "query-string";

import {StdTx} from "~src/libs/api";

type ContractIdType = "dcc" | "estate";
type RestGetParamTypes =
  | GetTxsParams
  | CrossCoordinatorStatusParams
  | undefined;

const initGet = (): RequestInit => {
  return {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
    }
  };
};

type RestPostMethods = "txs" | "cross/contract/call";
type RestPostParamTypes = BroadcastTxParams | CrossContractCallParams;

export type RestResponseTypes =
  | GetTxsResponse
  | BroadcastTxCommitResponse
  | AuthAccountResponse
  | CrossContractCallResponse
  | CrossCoordinatorStatusResponse;

const initPost = <P extends RestPostParamTypes>(body: P): RequestInit => {
  return {
    ...initGet(),
    method: "POST",
    body: JSON.stringify(body)
  };
};

export class RestClient {
  private readonly endPoint: string;

  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  get = <R extends RestResponseTypes, P extends RestGetParamTypes = undefined>(
    method: string
  ) => async (params?: P) => {
    let url = `${this.endPoint}/${method}`;

    if (params) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const query = stringify(params!);
      if (query) {
        url += `?${query}`;
      }
    }

    return await this.request<R>(fetch(url, initGet()));
  };

  post = <R extends RestResponseTypes, P extends RestPostParamTypes>(
    method: RestPostMethods
  ) => async (params: P) => {
    const url = `${this.endPoint}/${method}`;

    return await this.request<R>(fetch(url, initPost(params)));
  };

  request = async <R extends RestResponseTypes>(
    promise: Promise<Response>
  ): Promise<R> => {
    const response = await promise;

    if (!response.ok) {
      if (response.status > 400) {
        throw Error(`${JSON.stringify(response)}`);
      }
    }
    const rawData = await response.text();
    let data: R;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      throw new Error(`failed to parse response body: "${rawData}"`);
    }

    return data;
  };

  txs = this.get<GetTxsResponse, GetTxsParams>("txs");
  txsPost = this.post<BroadcastTxCommitResponse, BroadcastTxParams>("txs");
  authAccounts = (address: Address) =>
    this.get<AuthAccountResponse>(`auth/accounts/${address}`);

  crossCoordinatorStatus = this.get<
    CrossCoordinatorStatusResponse,
    CrossCoordinatorStatusParams
  >("cross/coordinator");

  crossContractCall = this.post<
    CrossContractCallResponse,
    CrossContractCallParams
  >("cross/contract/call");
}

type Address = string;
type Base64EncodedString = string;
type DecimalString = string;

export interface GetTxsParams {
  "message.sender"?: Address;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

interface GetTxsResponse {
  total_count: DecimalString;
  count: DecimalString;
  page_number: DecimalString;
  page_total: DecimalString;
  limit: DecimalString;
  txs: boolean[];
}

interface BroadcastTxParams {
  tx: StdTx;
  mode: "block" | "sync" | "async";
}

interface BroadcastTxCommitResponse {
  height: string;
  txhash: string;
  code?: number;
  codespace?: string;
  gas_wanted?: string;
  gas_used?: DecimalString;
  row_log?: string;
  error?: string;
}

export interface AuthAccountResponse {
  height: DecimalString;
  result: {
    type: "cosmos-sdk/Account";
    value: {
      address: Address;
      public_key: string;
      account_number: DecimalString;
      sequence?: DecimalString;
    };
  };
}

export interface CrossContractCallParams {
  from: Address;
  signers: Address[];
  call_info: ContractCallInfo;
}

export interface CrossContractCallResponse {
  height: DecimalString;
  result: ContractCallResponse;
}

export interface CrossCoordinatorStatusParams {
  tx_id: string;
}

export interface CrossCoordinatorStatusResponse {
  tx_id: string;
  coordinator_info: CoordinatorInfo;
  completed: boolean;
}

export interface CoordinatorInfo {
  transactions: string[]; // {TransactionID => ConnectionID}
  channels: ChannelInfo[]; // {TransactionID => Channel}
  status: number;
  decision: number;
  confirmedTransactions: number[]; // [TransactionID]
  acks: number[]; // [TransactionID]
}

export interface ChannelInfo {
  port: string;
  channel: string;
}

export interface ContractCallResponse {
  return_value: Base64EncodedString;
  ops: Op[];
}

export interface Op {
  type: "store/lock/Read" | "store/lock/Write";
  value: KV;
}

export interface KV {
  K: Base64EncodedString;
  V?: Base64EncodedString;
}

export interface ContractCallInfo {
  id: ContractIdType;
  method: string;
  args: Base64EncodedString[];
}

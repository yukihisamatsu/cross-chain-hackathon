import fetch from "cross-fetch";
import {stringify} from "query-string";

import {StdTx} from "~src/libs/api";
import {ContractCallStdTx} from "~src/libs/cosmos/util";

type ContractIdType = "dcc" | "estate";
type RestGetParamTypes = GetTxsParams | undefined;

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

  crossCoordinatorStatus = (txHash: string) =>
    this.get<CrossCoordinatorStatusResponse>(`cross/coordinator/${txHash}`);

  crossContractCall = this.post<
    CrossContractCallResponse,
    CrossContractCallParams
  >("cross/contract/call");
}

type Address = string;
type HexEncodedString = string;
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
  txs: GetTxsResponseTx[];
}

export interface GetTxsResponseTx {
  data: HexEncodedString;
  gas_used: DecimalString;
  gas_wanted: DecimalString;
  height: DecimalString;
  logs: {
    events: GetTxsResponseTxEvent[];
    log: string;
    msg_index: number;
  }[];
  row_log: string;
  timestamp: string;
  tx: {
    type: "cosmos-sdk/StdTx";
    value: StdTx | ContractCallStdTx;
  };
  txhash: HexEncodedString;
}

export interface GetTxsResponseTxEvent {
  attributes: {key: string; value: string}[];
  type: string;
}

interface BroadcastTxParams {
  tx: StdTx | ContractCallStdTx;
  mode: "block" | "sync" | "async";
}

export interface BroadcastTxCommitResponse {
  height: DecimalString;
  txhash: HexEncodedString;
  data?: HexEncodedString;
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

export interface CrossCoordinatorStatusResponse {
  height: DecimalString;
  result: {
    tx_id: string;
    completed: boolean;
    coordinator_info: CoordinatorInfo;
  };
  error?: string;
}

export interface CoordinatorInfo {
  Transactions: string[]; // {TransactionID => ConnectionID}
  Channels: ChannelInfo[]; // {TransactionID => Channel}
  Status: number;
  Decision: number;
  ConfirmedTransactions: number[]; // [TransactionID]
  Acks: number[]; // [TransactionID]
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

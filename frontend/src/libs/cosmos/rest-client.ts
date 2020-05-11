import fetch from "cross-fetch";
import {stringify} from "query-string";

type ContractIdType = "dcc" | "estate";

type RestGetMethods = "txs" | "cross/coordinator";
type RestGetParamTypes = TxsParams | CrossCoordinatorStatusParams;

const initGet = (): RequestInit => {
  return {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
    }
  };
};

type RestPostMethods = "cross/contract/call";
type RestPostParamTypes = CrossContractCallParams;

type RestResponseTypes =
  | TxsResponse
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

  get = <R extends RestResponseTypes, P extends RestGetParamTypes>(
    method: RestGetMethods
  ) => async (params: P) => {
    let url = `${this.endPoint}/${method}`;

    const query = stringify(params);
    if (query) {
      url += `?${query}`;
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
        throw Error(`response error. ${response}`);
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

  txs = this.get<TxsResponse, TxsParams>("txs");

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

export interface TxsParams {
  [key: string]: string;
}

interface TxsResponse {
  total_count: DecimalString;
  count: DecimalString;
  page_number: DecimalString;
  page_total: DecimalString;
  limit: DecimalString;
  txs: boolean[];
}

export interface CrossContractCallParams {
  from: Address;
  signers: Address[];
  call_info: ContractCallInfo;
}

interface CrossContractCallResponse {
  height: DecimalString;
  result: ContractCallResponse;
}

interface CrossCoordinatorStatusParams {
  tx_id: string;
}

interface CrossCoordinatorStatusResponse {
  tx_id: string;
  coordinator_info: CoordinatorInfo;
  completed: boolean;
}

interface CoordinatorInfo {
  transactions: string[]; // {TransactionID => ConnectionID}
  channels: ChannelInfo[]; // {TransactionID => Channel}
  status: number;
  decision: number;
  confirmedTransactions: number[]; // [TransactionID]
  acks: number[]; // [TransactionID]
}

interface ChannelInfo {
  port: string;
  channel: string;
}

interface ContractCallResponse {
  return_value: Base64EncodedString;
  ops: Op[];
}

interface Op {
  type: "store/lock/Read";
  value: KV;
}

interface KV {
  K: Base64EncodedString;
  V?: Base64EncodedString;
}

interface ContractCallInfo {
  id: ContractIdType;
  method: string;
  args: Base64EncodedString[];
}

import fetch from "cross-fetch";
import {stringify} from "query-string";

type RPCParamTypes = BroadcastTxParams;

type RPCMethods =
  | "subscribe"
  | "unsubscribe"
  | "unsubscribe_all"
  | "status"
  | "net_info"
  | "dial_peers"
  | "dial_seeds"
  | "genesis"
  | "health"
  | "block"
  | "block_results"
  | "blockchain"
  | "validators"
  | "consensus_state"
  | "dump_consensus_state"
  | "broadcast_tx_commit"
  | "broadcast_tx_sync"
  | "broadcast_tx_async"
  | "unconfirmed_txs"
  | "num_unconfirmed_txs"
  | "commit"
  | "tx"
  | "tx_search"
  | "abci_query"
  | "abci_info"
  | "unsafe_flush_mempool"
  | "unsafe_start_cpu_profiler"
  | "unsafe_stop_cpu_profiler"
  | "unsafe_write_heap_profile";

const init: RequestInit = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

class RPCClient {
  private readonly endPoint: string;

  constructor(endPoint: string) {
    this.endPoint = endPoint;
  }

  get = <R, P extends RPCParamTypes | undefined = undefined>(
    method: RPCMethods
  ) => async (params?: P) => {
    let url = `${this.endPoint}/${method}`;

    if (params) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const query = stringify(params!);
      if (query) {
        url += `?${query}`;
      }
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      if (response.status > 400) {
        throw Error(`response error. ${response}`);
      }
    }
    const rawData = await response.text();
    let data: APIResponse<R>;
    try {
      data = JSON.parse(rawData);
    } catch (e) {
      throw new Error(`failed to parse response body: "${rawData}"`);
    }

    if (data.error) {
      const err = Error(data.error.message);
      throw {err, ...data.error};
    }

    return data;
  };

  status = this.get<StatusResponse>("status");
  broadcastTxCommit = this.get<BroadcastTxCommitResponse, BroadcastTxParams>(
    "broadcast_tx_commit"
  );
}

type Base64EncodedString = string;

interface APIResponse<T> {
  id: string;
  jsonrpc: string;
  result: T;
  error?: {
    code: number;
    message: string;
    data: string;
  };
}

interface BroadcastTxParams {
  tx: string;
}

interface ABCIQueryResponse {
  response: {
    value: Base64EncodedString;
  };
}

interface ABCIQueryResponseData {
  Code: number;
  Codespace: string;
  Data: Base64EncodedString | null;
  Log: string;
  GasWanted: string;
  GasUsed: string;
  Events: TxResponseDataEvent[];
}

interface TxResponseDataEvent {
  type: string;
  attributes: {
    key: Base64EncodedString;
    value: Base64EncodedString;
  }[];
}

interface TxResponseDataLog {
  code: number;
  codespace: string;
  message: string;
}

interface BroadcastTxCommitResponse {
  height: string;
  hash: string;
  check_tx: BroadcastTxResponseCheckTx;
  deliver_tx: BroadcastTxResponseDeliverTx;
}

type BroadcastTxResponseCheckTx =
  | BroadcastTxResponseCheckTxSuccess
  | BroadcastTxResponseCheckTxFailed;

interface BroadcastTxResponseCheckTxSuccess {
  data: Base64EncodedString;
  events: TxResponseDataEvent[];
  gasUsed: string;
}

interface BroadcastTxResponseCheckTxFailed {
  code: number;
  events: TxResponseDataEvent[];
  gasUsed: string;
  log: string;
}

interface BroadcastTxResponseDeliverTx {
  data?: Base64EncodedString;
  events?: TxResponseDataEvent[];
  gasUsed?: string;
}

interface StatusResponse {
  node_info: NodeInfo;
  sync_info: SyncInfo;
  validator_info: ValidatorInfo;
}

interface NodeInfo {
  channels: string;
  id: string;
  listen_addr: string;
  moniker: string;
  network: string;
  other: {
    rpc_address: string;
    tx_index: string;
  };
  protocol_version: {
    app: string;
    block: string;
    p2p: string;
  };
}

interface SyncInfo {
  latest_block_hash: string;
  latest_app_hash: string;
  latest_block_height: string;
  latest_block_time: string;
  catching_up: boolean;
}

interface ValidatorInfo {
  address: string;
  pub_key: {
    type: string;
    value: string;
  };
  voting_power: string;
}

export {
  RPCClient,
  APIResponse,
  ABCIQueryResponse,
  ABCIQueryResponseData,
  TxResponseDataEvent,
  TxResponseDataLog,
  BroadcastTxParams,
  BroadcastTxCommitResponse,
  BroadcastTxResponseCheckTx,
  BroadcastTxResponseCheckTxSuccess,
  BroadcastTxResponseCheckTxFailed,
  BroadcastTxResponseDeliverTx,
  StatusResponse,
  NodeInfo,
  SyncInfo,
  ValidatorInfo
};

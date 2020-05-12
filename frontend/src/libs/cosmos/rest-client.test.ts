import BN from "bn.js";

import {
  CrossContractCallParams,
  RestClient
} from "~src/libs/cosmos/rest-client";

describe("cosmos rest client test suites", () => {
  const coordinatorClient = new RestClient("http://localhost:1317");
  const securityClient = new RestClient("http://localhost:1318");
  const coinClient = new RestClient("http://localhost:1319");

  test.skip("avoid unused error", () => {
    expect(coordinatorClient).not.toBeUndefined();
    expect(securityClient).not.toBeUndefined();
    expect(coinClient).not.toBeUndefined();
  });

  test("coin balanceOf Test", async () => {
    const params: CrossContractCallParams = {
      from: "cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02",
      signers: [],
      call_info: {
        id: "dcc",
        method: "balanceOf",
        args: [
          // cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02
          "Y29zbW9zMXlrMHg0cHFjd3l1eHRyc2Q4bnF6MngweGQzdWNhZmVkOTZ3ZDAy"
        ]
      }
    };
    const response = await coinClient.crossContractCall(params);
    const actual = Buffer.from(response.result.return_value, "base64").toString(
      "hex"
    );
    const bn = new BN(actual, "hex");
    expect(bn.toNumber()).toEqual(1000000);
  });

  test("balanceOf estate", async () => {
    const address = "cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9"; // Alice
    const addressBase64 = Buffer.from(address, "utf-8").toString("base64");
    const tokenId = new BN(1).toBuffer("be", 8).toString("base64");
    const params: CrossContractCallParams = {
      from: address,
      signers: [],
      call_info: {
        id: "estate",
        method: "balanceOf",
        args: [
          addressBase64,
          // uint64(1) or [0 0 0 0 0 0 0 1]
          tokenId // "AAAAAAAAAAE="
        ]
      }
    };
    const response = await securityClient.crossContractCall(params);
    const actual = new BN(Buffer.from(response.result.return_value, "base64"));
    expect(actual.toNumber()).toEqual(999);
  });

  test("balanceOf coin", async () => {
    const address = "cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02"; // Alice
    const addressBase64 = Buffer.from(address, "utf-8").toString("base64");
    const params: CrossContractCallParams = {
      from: address,
      signers: [],
      call_info: {
        id: "dcc",
        method: "balanceOf",
        args: [addressBase64]
      }
    };
    const response = await coinClient.crossContractCall(params);
    const actual = new BN(Buffer.from(response.result.return_value, "base64"));
    expect(actual.toNumber()).toEqual(1000000);
  });

  test("sell request status", async () => {
    const params = {
      tx_id: "1D025CB54F3B863EBECF4D8E85BC2352C45DB88A411755C2FC6D19F735B7734B"
    };
    const result = await coinClient.crossCoordinatorStatus(params);
    expect(result).not.toBeUndefined();
  });

  test("event type Test", async () => {
    const address = "cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02";
    const response = await securityClient.txs({
      "message.sender": address
    });
    expect(response.total_count).not.toEqual("0");
  });
});

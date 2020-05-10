import {RPCClient} from "~src/libs/cosmos/rpc-client";

describe("cosmos rpc client test suites", () => {
  const coordinatorClient = new RPCClient("http://localhost:26657");
  const securityClient = new RPCClient("http://localhost:26660");
  const coinClient = new RPCClient("http://localhost:26662");

  test.skip("avoid unused error", () => {
    expect(coordinatorClient).not.toBeUndefined();
    expect(securityClient).not.toBeUndefined();
    expect(coinClient).not.toBeUndefined();
  });

  test("status Test", async () => {
    const result = await coordinatorClient.status();
    expect(Number(result.result.sync_info.latest_block_height)).toBeGreaterThan(
      0
    );
  });

  test("block Test", async () => {
    const result = await coordinatorClient.block({height: 1});
    expect(result.result.block_id.hash).not.toBeUndefined();
  });

  test("tx search Test", async () => {
    const blockHeight = 5;
    const result = await coordinatorClient.txSearch({
      query: `"tx.height=${blockHeight}"`
    });
    expect(result).not.toBeUndefined();
  });

  test("event type Test", async () => {
    // const address = "cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02";
    const result = await securityClient.txSearch({
      query: `"TRANSFER.tokenID='1'"`
    });
    expect(result.result.total_count).not.toEqual("0");
  });
});

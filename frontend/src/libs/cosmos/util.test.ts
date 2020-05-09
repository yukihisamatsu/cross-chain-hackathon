import {
  getAddress,
  getECPairPriv,
  getPubKeyBase64
} from "~src/libs/cosmos/util";

describe("cosmos lib", () => {
  const mnemonic =
    "drift choose subject relief sell ask vague lonely inform bacon film sugar what waste pelican civil lady hamster drum adapt combine hawk armor pioneer";
  const address = "cosmos18a3qm458qgl9svy970pvkuq0tw5pll6pq622uk";

  test("get address from mnemonic phrase", () => {
    expect(getAddress(mnemonic)).toEqual(address);
  });

  test("get getECPairPriv from mnemonic phrase", () => {
    const privKey = getECPairPriv(mnemonic);
    expect(privKey).not.toBeUndefined();
    expect(privKey).toHaveLength(32);
  });

  test("get getPubKeyBase64 from mnemonic phrase", () => {
    const privKey = getECPairPriv(mnemonic);
    const pubKeyBase64 = getPubKeyBase64(privKey);
    expect(pubKeyBase64).not.toBeUndefined();
    expect(pubKeyBase64).toHaveLength(44);
  });
});

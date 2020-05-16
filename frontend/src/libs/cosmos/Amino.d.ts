export function encodeContractCallInfo(
  json: Uint8Array,
  lengthPrefixed: boolean
): Uint8Array;

export function decodeContractCallInfo(
  amino: Uint8Array,
  lengthPrefixed: boolean
): Uint8Array;

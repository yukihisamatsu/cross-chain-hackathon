package lib

import "github.com/datachainlab/cross-chain-hackathon/frontend/gopherjs/types/cross/contract"

func EncodeContractCallInfo(bz []byte, lengthPrefix bool) []byte {
	var o contract.ContractCallInfo
	var err error

	if err = codec.UnmarshalJSON(bz, &o); err != nil {
		panic(err)
	}

	var ret []byte

	if lengthPrefix {
		ret, err = codec.MarshalBinaryLengthPrefixed(o)
	} else {
		ret, err = codec.MarshalBinaryBare(o)
	}

	if err != nil {
		panic(err)
	}

	return ret
}

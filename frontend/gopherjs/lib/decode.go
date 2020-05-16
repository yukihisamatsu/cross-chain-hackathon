package lib

import (
	"github.com/datachainlab/cross-chain-hackathon/frontend/gopherjs/types/cross/contract"
)

func DecodeContractCallInfo(bz []byte, lengthPrefixed bool) []byte {
	var o contract.ContractCallInfo
	var err error

	if lengthPrefixed {
		if err = codec.UnmarshalBinaryLengthPrefixed(bz, &o); err != nil {
			panic(err)
		}
	} else {
		if err = codec.UnmarshalBinaryBare(bz, &o); err != nil {
			panic(err)
		}
	}

	ret, err := codec.MarshalJSON(o)
	if err != nil {
		panic(err)
	}

	return ret
}

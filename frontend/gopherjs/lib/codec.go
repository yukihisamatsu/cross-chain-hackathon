package lib

import (
	"github.com/tendermint/go-amino"

	"github.com/datachainlab/cross-chain-hackathon/frontend/gopherjs/types/cross/contract"
)

var codec *amino.Codec

func init() {
	codec = amino.NewCodec()
	RegisterCodec(codec)
	codec.Seal()
}

func RegisterCodec(codec *amino.Codec) {
	codec.RegisterConcrete(contract.ContractCallInfo{}, "contract/ContractCallInfo", nil)
}

package main

import (
	"fmt"

	"github.com/gopherjs/gopherjs/js"

	"github.com/datachainlab/cross-chain-hackathon/frontend/gopherjs/lib"
)

func main() {
	exports := js.Module.Get("exports")
	fmt.Printf("%v", exports)

	exports.Set("encodeContractCallInfo", lib.EncodeContractCallInfo)
	exports.Set("decodeContractCallInfo", lib.DecodeContractCallInfo)
}

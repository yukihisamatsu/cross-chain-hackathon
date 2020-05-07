package securitychain

import (
	"fmt"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/common"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/cross"
)

// addToWhitelist(address _addr) public returns bool
func addToWhitelist(ctx contract.Context, store cross.Store) ([]byte, error) {
	from := ctx.Signers()[0]
	args := ctx.Args()
	if len(args) != 1 {
		return nil, fmt.Errorf("invalid argument length")
	}
	to := args[0]
	if err := common.VerifyAddress(to); err != nil {
		return nil, fmt.Errorf("invalid address: %v", to)
	}
	key := makeWhitelistKey(to, from)
	if store.Has(key) {
		return nil, fmt.Errorf("already added")
	}
	trueB := contract.ToBytes(true)
	store.Set(key, trueB)
	return trueB, nil
}

// isWhitelisted(address _addr, address _by) public returns bool
func isWhitelisted(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if len(args) != 2 {
		return nil, fmt.Errorf("invalid argument length")
	}
	to := args[0]
	if err := common.VerifyAddress(to); err != nil {
		return nil, fmt.Errorf("invalid address: %v", to)
	}
	by := args[1]
	if err := common.VerifyAddress(by); err != nil {
		return nil, fmt.Errorf("invalid address: %v", by)
	}
	return contract.ToBytes(getWhitelisted(to, by, store)), nil
}

func getWhitelisted(addr, by []byte, store cross.Store) bool {
	key := makeWhitelistKey(addr, by)
	if store.Has(key) {
		return contract.Bool(store.Get(key))
	}
	return false
}

func makeWhitelistKey(addr, by []byte) []byte {
	return []byte(fmt.Sprintf("whitelist/%v/by/%v", addr, by))
}

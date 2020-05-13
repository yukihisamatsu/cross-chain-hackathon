package common

import (
	"errors"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/cross"
)

var (
	ErrorInvalidArgsLength = errors.New("invalid args length")
)

func GetBool(key []byte, store cross.Store) bool {
	if store.Has(key) {
		return contract.Bool(store.Get(key))
	}
	return false
}

func GetInt64(key []byte, store cross.Store) int64 {
	if store.Has(key) {
		return contract.Int64(store.Get(key))
	}
	return 0
}

func GetUInt64(key []byte, store cross.Store) uint64 {
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
}

func VerifyArgsLength(args [][]byte, expected int) error {
	if len(args) != expected {
		return ErrorInvalidArgsLength
	}
	return nil
}

func GetAccAddress(sb []byte) (sdk.AccAddress, error) {
	return sdk.AccAddressFromBech32(string(sb))
}

func GetUInt64String(v uint64) string {
	return strconv.FormatUint(v, 10)
}

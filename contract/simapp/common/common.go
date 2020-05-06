package common

import (
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

var (
	ErrorInvalidArgsLength = errors.New("invalid args length")
)

func VerifyAddress(addr []byte) error {
	return sdk.VerifyAddressFormat(addr)
}

func VerifyArgsLength(args [][]byte, expected int) error {
	if len(args) != expected {
		return ErrorInvalidArgsLength
	}
	return nil
}

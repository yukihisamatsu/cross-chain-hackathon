package common

import (
	"errors"
)

var (
	ErrorInvalidArgsLength = errors.New("invalid args length")
)

// HACK impl
func VerifyAddress(addr []byte) error {
	//return sdk.VerifyAddressFormat(addr)
	return nil
}

func VerifyArgsLength(args [][]byte, expected int) error {
	if len(args) != expected {
		return ErrorInvalidArgsLength
	}
	return nil
}

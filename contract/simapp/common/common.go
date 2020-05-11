package common

import (
	"errors"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

var (
	ErrorInvalidArgsLength = errors.New("invalid args length")
)

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

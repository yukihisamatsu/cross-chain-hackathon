package securitychain

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/cross"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/common"
	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/safemath"
)

// this method is to be called before Cross MessageIntiate
// this increments the token's dividend index
// registerDividend(uint256 _tokenId, uint256 _perShare) public returns (uint256 _dividendId)
func registerDividend(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	perShare := contract.UInt64(args[1])
	if !isCreator(ctx.Signers()[0], tokenID, store) {
		return nil, ErrorInvalidSender
	}
	lastIndex := getDividendIndex(tokenID, store)
	if lastIndex != 0 && !getDividendPaid(tokenID, lastIndex, store) {
		return nil, ErrorDividendNotPaid
	}

	index, ok := safemath.Add64(lastIndex, 1)
	if !ok {
		return nil, ErrorAddition
	}
	setDividendIndex(tokenID, index, store)
	setDividendPerShare(tokenID, index, perShare, store)

	emitDividendRegistered(ctx, tokenID, index, perShare)
	return contract.ToBytes(index), nil
}

// payDividend(uint256 _tokenId, uint256 _index) public returns (bool)
// this method is to be called via Cross
func payDividend(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	index := contract.UInt64(args[1])
	if !isCreator(ctx.Signers()[0], tokenID, store) {
		return nil, ErrorInvalidSender
	}
	if getDividendPaid(tokenID, index, store) {
		return nil, ErrorDividendPaid
	}
	if index == 0 || index != getDividendIndex(tokenID, store) {
		return nil, ErrorInvalidArg
	}
	setDividendPaid(tokenID, index, store)
	emitDividenPaid(ctx, tokenID, index)
	return contract.ToBytes(true), nil
}

// dividendIndexOf(uint256 _tokenId) public returns (uint256 _index)
func dividendIndexOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 1); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	return contract.ToBytes(getDividendIndex(tokenID, store)), nil
}

// get the latest dividend
// dividendOf(address _owner, uint256 _tokenId) public returns (uint256)
func dividendOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	addr, err := common.GetAccAddress(args[0])
	if err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[1])
	amount := getAmount(addr, tokenID, store)
	lastIndex := getDividendIndex(tokenID, store)
	perShare := getDividendPerShare(tokenID, lastIndex, store)
	delta := getDividendDelta(addr, tokenID, lastIndex, store)
	var ok bool
	if delta >= 0 {
		if amount, ok = safemath.Add64(amount, uint64(delta)); !ok {
			return nil, ErrorAddition
		}
	} else {
		if amount, ok = safemath.Sub64(amount, uint64(-delta)); !ok {
			return nil, ErrorSubtraction
		}
	}

	if res, ok := safemath.Mul64(amount, perShare); ok {
		return contract.ToBytes(res), nil
	}
	return nil, ErrorMultiplication
}

// dividendPerShareof(uint256 _tokenId, uint256 _index) public returns (uint256)
func dividendPerShareOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	index := contract.UInt64(args[1])
	return contract.ToBytes(getDividendPerShare(tokenID, index, store)), nil
}

// isDividendPaid(uint256 _tokenId, uint256 _index) public returns (uint256)
func isDividendPaid(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	index := contract.UInt64(args[1])
	return contract.ToBytes(getDividendPaid(tokenID, index, store)), nil
}

func emitDividendRegistered(ctx contract.Context, tokenID, index, perShare uint64) {
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(EventNameDividendRegistered,
			sdk.NewAttribute("tokenID", common.GetUInt64String(tokenID)),
			sdk.NewAttribute("index", common.GetUInt64String(index)),
			sdk.NewAttribute("perShare", common.GetUInt64String(perShare)),
		))
}

func emitDividenPaid(ctx contract.Context, tokenID, index uint64) {
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(EventNameDividendPaid,
			sdk.NewAttribute("tokenID", common.GetUInt64String(tokenID)),
			sdk.NewAttribute("index", common.GetUInt64String(index)),
		))
}

func makeDividendDeltaKey(addr sdk.AccAddress, tokenID, index uint64) []byte {
	return []byte(fmt.Sprintf("dividendDelta/%s/token/%d/index/%d", addr.String(), tokenID, index))
}

func makeDividendIndexKey(tokenID uint64) []byte {
	return []byte(fmt.Sprintf("dividendIndex/%d", tokenID))
}

func makeDividendPerShareKey(tokenID, index uint64) []byte {
	return []byte(fmt.Sprintf("dividendPerShare/%d/index/%d", tokenID, index))
}

func makeDividendPaidKey(tokenID, index uint64) []byte {
	return []byte(fmt.Sprintf("dividendPaid/%d/index/%d", tokenID, index))
}

func getDividendIndex(tokenID uint64, store cross.Store) uint64 {
	key := makeDividendIndexKey(tokenID)
	return common.GetUInt64(key, store)
}

func getDividendDelta(addr sdk.AccAddress, tokenID, index uint64, store cross.Store) int64 {
	key := makeDividendDeltaKey(addr, tokenID, index)
	return common.GetInt64(key, store)
}

func getDividendPerShare(tokenID, index uint64, store cross.Store) uint64 {
	key := makeDividendPerShareKey(tokenID, index)
	return common.GetUInt64(key, store)
}

func getDividendPaid(tokenID, index uint64, store cross.Store) bool {
	key := makeDividendPaidKey(tokenID, index)
	return common.GetBool(key, store)
}

func setDividendIndex(tokenID, index uint64, store cross.Store) uint64 {
	key := makeDividendIndexKey(tokenID)
	store.Set(key, contract.ToBytes(index))
	return 0
}

func setDividendDelta(addr sdk.AccAddress, tokenID, index uint64, delta int64, store cross.Store) uint64 {
	key := makeDividendDeltaKey(addr, tokenID, index)
	store.Set(key, contract.ToBytes(delta))
	return 0
}

func setDividendPerShare(tokenID, index, perShare uint64, store cross.Store) uint64 {
	key := makeDividendPerShareKey(tokenID, index)
	store.Set(key, contract.ToBytes(perShare))
	return 0
}

func setDividendPaid(tokenID, index uint64, store cross.Store) uint64 {
	key := makeDividendPaidKey(tokenID, index)
	store.Set(key, contract.ToBytes(true))
	return 0
}

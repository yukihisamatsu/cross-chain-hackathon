package coinchain

import (
	"bytes"
	"encoding/binary"
	"fmt"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/common"
	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/safemath"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/cross"
	"github.com/datachainlab/cross/x/ibc/store/lock"
)

const (
	DatachainCoinContractID = "dcc"
	FnNameBalanceOf         = "balanceOf"
	FnNameMint              = "mint"
	FnNameTransfer          = "transfer"
	FnNameTransferBatch     = "transferBatch"
	FnNameTotalSupply       = "totalSupply"
	EventNameTransfer       = "Transfer"
)

func DatachainCoinContractHandler(k contract.Keeper) cross.ContractHandler {
	contractHandler := contract.NewContractHandler(k, func(store sdk.KVStore) cross.State {
		return lock.NewStore(store)
	})

	contractHandler.AddRoute(DatachainCoinContractID, GetDatachainCoinContract())
	return contractHandler
}

func GetDatachainCoinContract() contract.Contract {
	return contract.NewContract([]contract.Method{
		{
			Name: FnNameBalanceOf, F: balanceOf,
		},
		{
			Name: FnNameMint, F: mint,
		},
		{
			Name: FnNameTotalSupply, F: totalSupply,
		},
		{
			Name: FnNameTransfer, F: transfer,
		},
		{
			Name: FnNameTransferBatch, F: transferBatch,
		},
		{
			Name: "getSigner", F: getSigner,
		},
		{
			Name: "isSame", F: isSame,
		},
	})
}

func isSame(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 1); err != nil {
		return nil, err
	}
	from := ctx.Signers()[0]
	addr, err := common.GetAccAddress(args[0])
	if err != nil {
		return nil, err
	}
	if bytes.Equal(from, addr) {
		return contract.ToBytes(true), nil
	}
	return nil, fmt.Errorf("from, arg are different:\t%v\t%v\n", from, addr)
}

func getSigner(ctx contract.Context, store cross.Store) ([]byte, error) {
	return ctx.Signers()[0], nil
}

// function balanceOf(address _owner) public view returns (uint256 balance)
func balanceOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 1); err != nil {
		return nil, err
	}
	addr, err := common.GetAccAddress(args[0])
	if err != nil {
		return nil, err
	}
	return contract.ToBytes(getAmount(addr, store)), nil
}

// HACK set owner
// function mint(address account, uint256 amount) public returns (bool success) {
func mint(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	to, err := common.GetAccAddress(args[0])
	if err != nil {
		return nil, err
	}
	value := contract.UInt64(args[1])
	if toAmount, ok := safemath.Add64(getAmount(to, store), value); ok {
		setAmount(to, toAmount, store)
	} else {
		return nil, ErrorAdditionOverflow
	}

	if totalSupply, ok := safemath.Add64(getTotalSupply(store), value); ok {
		setTotalSupply(totalSupply, store)
	} else {
		return nil, ErrorAdditionOverflow
	}

	emitTransfer(ctx, []byte{}, to, value)
	return contract.ToBytes(true), nil
}

func totalSupply(ctx contract.Context, store cross.Store) ([]byte, error) {
	return contract.ToBytes(getTotalSupply(store)), nil
}

// almost same as ERC20: transfer(address _to, uint256 _value) public returns (bool success)
func transfer(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	from := ctx.Signers()[0]
	to, err := common.GetAccAddress(args[0])
	if err != nil {
		return nil, err
	}
	value := contract.UInt64(args[1])

	if fromAmount, ok := safemath.Sub64(getAmount(from, store), value); ok {
		setAmount(from, fromAmount, store)
	} else {
		return nil, fmt.Errorf("unsufficient amount of %s: %d", from.String(), getAmount(from, store))
	}
	if toAmount, ok := safemath.Add64(getAmount(to, store), value); ok {
		setAmount(to, toAmount, store)
	} else {
		return nil, ErrorAdditionOverflow
	}
	emitTransfer(ctx, from, to, value)
	return contract.ToBytes(true), nil
}

// transferBatch(address _to, uint256 _value) public returns (bool success)
func transferBatch(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	from := ctx.Signers()[0]
	tos, err := splitAddrs(args[0])
	if err != nil {
		return nil, ErrorInvalidArg
	}
	values, err := splitUInt64s(args[1])
	if err != nil {
		return nil, ErrorInvalidArg
	}
	if len(tos) != len(values) {
		return nil, ErrorInvalidArg
	}
	sums := uint64(0)
	for _, v := range values {
		sums += v
	}
	if fromAmount, ok := safemath.Sub64(getAmount(from, store), sums); ok {
		setAmount(from, fromAmount, store)
	} else {
		return nil, fmt.Errorf("unsufficient amount of %s: %d", from.String(), getAmount(from, store))
	}

	for i, to := range tos {
		if toAmount, ok := safemath.Add64(getAmount(to, store), values[i]); ok {
			setAmount(to, toAmount, store)
		} else {
			return nil, ErrorAdditionOverflow
		}
		emitTransfer(ctx, from, to, values[i])
	}
	return contract.ToBytes(true), nil
}

func splitUInt64s(b []byte) ([]uint64, error) {
	buf := bytes.NewBuffer(b)
	res := make([]uint64, (len(b)+7)/8)
	err := binary.Read(buf, binary.BigEndian, &res)
	if err != nil {
		return nil, err
	}
	return res, nil
}

func splitAddrs(b []byte) ([]sdk.AccAddress, error) {
	size := 45 // string address
	l := (len(b) + (size - 1)) / size
	res := make([]sdk.AccAddress, l)
	for i := 0; i < l; i++ {
		start := i * size
		ab := b[start:(start + size)]
		addr, err := common.GetAccAddress(ab)
		if err != nil {
			return nil, err
		}
		res[i] = addr
	}
	return res, nil
}

func emitTransfer(ctx contract.Context, from, to sdk.AccAddress, value uint64) {
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(EventNameTransfer,
			sdk.NewAttribute("from", from.String()),
			sdk.NewAttribute("to", to.String()),
			sdk.NewAttribute("value", common.GetUInt64String(value)),
		))
}

func getAmount(addr []byte, store cross.Store) uint64 {
	key := makeAccountKey(addr)
	return common.GetUInt64(key, store)
}

func getTotalSupply(store cross.Store) uint64 {
	key := makeTotalSupplyKey()
	return common.GetUInt64(key, store)
}

func setAmount(addr sdk.AccAddress, amount uint64, store cross.Store) uint64 {
	key := makeAccountKey(addr)
	store.Set(key, contract.ToBytes(amount))
	return 0
}

func setTotalSupply(amount uint64, store cross.Store) uint64 {
	key := makeTotalSupplyKey()
	store.Set(key, contract.ToBytes(amount))
	return 0
}

func makeAccountKey(addr sdk.AccAddress) []byte {
	return []byte(fmt.Sprintf("account/%s", addr.String()))
}

func makeTotalSupplyKey() []byte {
	return []byte("totalSupply")
}

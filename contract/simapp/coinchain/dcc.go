package coinchain

import (
	"bytes"
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
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
}

func getTotalSupply(store cross.Store) uint64 {
	key := makeTotalSupplyKey()
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
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

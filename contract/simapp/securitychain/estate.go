package securitychain

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

// TODO
const (
	EstateTokenContractID = "estate"
	FnNameBalanceOf       = "balanceOf"
	//FnNameBalanceOfBatch  = "balanceOfBatch"
	FnNameCreate      = "create"
	FnNameCreatorOf   = "creatorOf"
	FnNameMint        = "mint"
	FnNameTransfer    = "transfer"
	FnNameTotalSupply = "totalSupply"

	FnNameAddToWhitelist = "addToWhitelist"
	// FnNameRemoveFromWhitelist  = "removeFromWhitelist"
	FnNameIsWhitelisted = "isWhitelisted"

	FnNameAddDividendPerShare = "addDividendPerShare"
	FnNamePayDividend         = "payDividend"
	FnNameDividendOf          = "dividendOf"

	EventNameTransfer = "Transfer"
)

func EstateTokenContractHandler(k contract.Keeper) cross.ContractHandler {
	contractHandler := contract.NewContractHandler(k, func(store sdk.KVStore) cross.State {
		return lock.NewStore(store)
	})

	contractHandler.AddRoute(EstateTokenContractID, GetEstateTokenContract())
	return contractHandler
}

func GetEstateTokenContract() contract.Contract {
	return contract.NewContract([]contract.Method{
		{
			Name: FnNameBalanceOf, F: balanceOf,
		},
		// to implement this, modify x/ibc/contract/types.go for slice
		/*
			{
				Name: FnNameBalanceOfBatch, F: balanceOfBatch,
			},
		*/
		{
			Name: FnNameCreate, F: create,
		},
		{
			Name: FnNameCreatorOf, F: creatorOf,
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
		// Whitelist
		{
			Name: FnNameAddToWhitelist, F: addToWhitelist,
		},
		/*
			{
				Name: FnNameRemoveFromWhitelist, F: removeFromWhitelist,
			},
		*/
		{
			Name: FnNameIsWhitelisted, F: isWhitelisted,
		},
		// Logic

		// Dividend
		{
			Name: FnNameAddDividendPerShare, F: addDividendPerShare,
		},
		{
			Name: FnNamePayDividend, F: payDividend,
		},
		{
			Name: FnNameDividendOf, F: dividendOf,
		},
	})
}

// function balanceOf(address _owner, uint256 _id) external view returns (uint256) {
func balanceOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	addr := args[0]
	if err := common.VerifyAddress(addr); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[1])
	return contract.ToBytes(getAmount(addr, tokenID, store)), nil
}

// function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids) external view returns (uint256[] memory)
/*
func balanceOfBatch(ctx contract.Context, store cross.Store) ([]byte, error) {
	return nil, ErrorNotImplemented
}
*/

// TODO we won't use token URI
//	function create(uint256 _initialSupply, string calldata _uri) external returns(uint256 _id) {
func create(ctx contract.Context, store cross.Store) ([]byte, error) {
	creator := ctx.Signers()[0]
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 2); err != nil {
		return nil, err
	}
	tokenID := getTokenID(store)
	var ok bool
	if tokenID, ok = safemath.Add64(tokenID, 1); ok {
		setTokenID(tokenID, store)
	} else {
		return nil, ErrorAdditionOverflow
	}
	tokenIDB := contract.ToBytes(tokenID)
	store.Set(makeCreatorKey(tokenID), creator)
	supply := contract.UInt64(args[0])
	supplyB := contract.ToBytes(supply)
	store.Set(makeTotalSupplyKey(tokenID), supplyB)
	store.Set(makeAccountKey(creator, tokenID), supplyB)
	emitTransfer(ctx, []byte{}, creator, tokenID, supply)
	return tokenIDB, nil
}

//	function creatorOf(uint256 _id) external returns(address _creator) {
func creatorOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 1); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	key := makeCreatorKey(tokenID)
	if store.Has(key) {
		return store.Get(key), nil
	}
	return nil, ErrorInvalidArg
}

// function mint(uint256 _id, address account, uint256 amount) public returns (bool success) {
func mint(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 3); err != nil {
		return nil, err
	}

	tokenID := contract.UInt64(args[0])
	sender := ctx.Signers()[0]
	if creator := getCreator(tokenID, store); creator == nil || bytes.Equal(creator, sender) {
		return nil, ErrorInvalidSender
	}

	to := args[1]
	if err := common.VerifyAddress(to); err != nil {
		return nil, err
	}
	if !getWhitelisted(to, sender, store) {
		return nil, ErrorNotWhitelisted
	}

	value := contract.UInt64(args[2])
	if toAmount, ok := safemath.Add64(getAmount(to, tokenID, store), value); ok {
		setAmount(to, tokenID, toAmount, store)
	} else {
		return nil, ErrorAdditionOverflow
	}

	if totalSupply, ok := safemath.Add64(getTotalSupply(tokenID, store), value); ok {
		setTotalSupply(totalSupply, tokenID, store)
	} else {
		return nil, ErrorAdditionOverflow
	}

	emitTransfer(ctx, []byte{}, to, tokenID, value)
	return contract.ToBytes(true), nil
}

// function totalSupply(uint256 _id) external returns(uint256 _value)
func totalSupply(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 1); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	key := makeTotalSupplyKey(tokenID)
	if store.Has(key) {
		return store.Get(key), nil
	}
	return nil, ErrorInvalidArg
}

// function transfer(uint256 _id, address _to, uint256 _value) public returns (bool success)
func transfer(ctx contract.Context, store cross.Store) ([]byte, error) {
	args := ctx.Args()
	if err := common.VerifyArgsLength(args, 3); err != nil {
		return nil, err
	}
	tokenID := contract.UInt64(args[0])
	creator := getCreator(tokenID, store)
	if creator == nil {
		return nil, ErrorInvalidArg
	}
	to := args[1]
	if err := common.VerifyAddress(to); err != nil {
		return nil, err
	}
	if !getWhitelisted(to, creator, store) {
		return nil, ErrorNotWhitelisted
	}

	value := contract.UInt64(args[2])
	from := ctx.Signers()[0]
	if fromAmount, ok := safemath.Sub64(getAmount(from, tokenID, store), value); ok {
		setAmount(from, tokenID, fromAmount, store)
	} else {
		return nil, ErrorInsufficientAmount
	}
	if toAmount, ok := safemath.Add64(getAmount(to, tokenID, store), value); ok {
		setAmount(to, tokenID, toAmount, store)
	} else {
		return nil, ErrorAdditionOverflow
	}
	emitTransfer(ctx, from, to, tokenID, value)
	return contract.ToBytes(true), nil
}

func emitTransfer(ctx contract.Context, from, to []byte, tokenID, value uint64) {
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(EventNameTransfer,
			sdk.NewAttribute("from", fmt.Sprint(from)),
			sdk.NewAttribute("to", fmt.Sprint(to)),
			sdk.NewAttribute("tokenID", fmt.Sprint(tokenID)),
			sdk.NewAttribute("value", fmt.Sprint(value)),
		))
}

func getAmount(addr []byte, token uint64, store cross.Store) uint64 {
	key := makeAccountKey(addr, token)
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
}

func getCreator(token uint64, store cross.Store) []byte {
	key := makeCreatorKey(token)
	if store.Has(key) {
		return store.Get(key)
	}
	return nil
}

func getTokenID(store cross.Store) uint64 {
	key := makeLastTokenIDKey()
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
}

func getTotalSupply(tokenID uint64, store cross.Store) uint64 {
	key := makeTotalSupplyKey(tokenID)
	if store.Has(key) {
		return contract.UInt64(store.Get(key))
	}
	return 0
}

func setAmount(addr []byte, tokenID, amount uint64, store cross.Store) uint64 {
	key := makeAccountKey(addr, tokenID)
	store.Set(key, contract.ToBytes(amount))
	return 0
}

func setTokenID(id uint64, store cross.Store) uint64 {
	key := makeLastTokenIDKey()
	store.Set(key, contract.ToBytes(id))
	return 0
}

func setTotalSupply(amount, tokenID uint64, store cross.Store) uint64 {
	key := makeTotalSupplyKey(tokenID)
	store.Set(key, contract.ToBytes(amount))
	return 0
}

func makeAccountKey(addr []byte, tokenID uint64) []byte {
	return []byte(fmt.Sprintf("account/%v/token/%v", addr, contract.ToBytes(tokenID)))
}

func makeCreatorKey(tokenID uint64) []byte {
	return []byte(fmt.Sprintf("creator/%v", contract.ToBytes(tokenID)))
}

func makeLastTokenIDKey() []byte {
	return []byte("tokenid")
}

func makeTotalSupplyKey(tokenID uint64) []byte {
	return []byte(fmt.Sprintf("totalSupply/%v", contract.ToBytes(tokenID)))
}

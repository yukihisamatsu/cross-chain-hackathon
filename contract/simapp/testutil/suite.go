package testutil

import (
	"github.com/datachainlab/cross/x/ibc/cross"
	"github.com/stretchr/testify/suite"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/contract/keeper"
)

type BaseTestSuite struct {
	suite.Suite
	Store cross.Store
}

// before each test
func (suite *BaseTestSuite) SetupTest() {
	suite.Store = NewMockStore()
}

type ContractMethod func(contract.Context, cross.Store) ([]byte, error)

func (s *BaseTestSuite) Call(m ContractMethod, signer string, args ...[]byte) ([]byte, sdk.Events, error) {
	ctx := s.NewContext([]string{signer}, args)
	res, err := m(ctx, s.Store)
	return res, ctx.EventManager().Events(), err
}

func (s *BaseTestSuite) NewContext(signers []string, args [][]byte) contract.Context {
	ss := make([]sdk.AccAddress, len(signers))
	for i, s := range signers {
		ss[i], _ = sdk.AccAddressFromBech32(s)
	}
	return keeper.NewContext(ss, args)
}

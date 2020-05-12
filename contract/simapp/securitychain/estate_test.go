package securitychain

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/testutil"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/stretchr/testify/suite"
)

var (
	addr1 = "cosmos1j42p6wpqwgw8tcyk44vdkyywa0d4qhk2f7kv73"
	addr2 = "cosmos1fl8s5ea88asrw0rewzgkwrsm2w8r54j43e6hqz"
	addr3 = "cosmos1w3uxw5vhjlrlyh7gvylacvgvca93wen9dggp2g"
	addr4 = "cosmos1764yuc2jyrtsn5artkmlkp0v43grwyutwuw0rz"
)

type EstateTestSuite struct {
	testutil.BaseTestSuite
}

func (s *EstateTestSuite) TestCreate() {
	initSupply := uint64(100)
	_, _, err := s.Call(create, addr1, contract.ToBytes(initSupply), []byte{})
	s.NoError(err)
	// create() does not emit an event for now
	/*
		s.Equal(1, len(evs))
		s.Equal(EventNameTransfer, evs[0].Type)
		expectedID := uint64(1)
		s.Equal(expectedID, contract.UInt64(evs[0].GetAttributes()[[]byte("tokenID")]))
	*/
	id := uint64(1)
	vb, _, err := s.Call(totalSupply, addr1, contract.ToBytes(id))
	s.NoError(err)
	s.Equal(initSupply, contract.UInt64(vb))

	creator, _, err := s.Call(creatorOf, addr1, contract.ToBytes(id))
	s.NoError(err)
	expected, _ := sdk.AccAddressFromBech32(addr1)
	s.Equal(expected.Bytes(), creator)

	vb, _, err = s.Call(balanceOf, addr1, []byte(addr1), contract.ToBytes(id))
	s.Equal(initSupply, contract.UInt64(vb))
}

func (s *EstateTestSuite) TestMint_NotWhitelisted() {
	_, _, err := s.Call(create, addr1, contract.ToBytes(uint64(0)), []byte{})
	s.NoError(err)

	id := contract.ToBytes(uint64(1))
	v := uint64(100)
	_, _, err = s.Call(mint, addr1, id, []byte(addr2), contract.ToBytes(v))
	s.Error(err)
}

func (s *EstateTestSuite) TestMint_Whitelisted() {
	_, _, err := s.Call(create, addr1, contract.ToBytes(uint64(0)), []byte{})
	s.NoError(err)
	_, _, err = s.Call(addToWhitelist, addr1, []byte(addr2))
	s.NoError(err)

	id := contract.ToBytes(uint64(1))
	v := uint64(100)
	_, evs, err := s.Call(mint, addr1, id, []byte(addr2), contract.ToBytes(v))
	s.NoError(err)
	s.Equal(1, len(evs))
	s.Equal(EventNameTransfer, evs[0].Type)

	vb, _, err := s.Call(balanceOf, addr1, []byte(addr2), id)
	s.Equal(v, contract.UInt64(vb))

	vb, _, err = s.Call(totalSupply, addr1, id)
	s.Equal(v, contract.UInt64(vb))
}

func (s *EstateTestSuite) TestTransfer_NotWhitelisted() {
	_, _, err := s.Call(create, addr1, contract.ToBytes(uint64(0)), []byte{})
	s.NoError(err)

	id := contract.ToBytes(uint64(1))
	v := uint64(100)
	_, _, err = s.Call(transfer, addr1, id, []byte(addr2), contract.ToBytes(v))
	s.Error(err)
}

func (s *EstateTestSuite) TestTransfer_Whitelisted() {
	initialSupply := uint64(100)
	_, _, err := s.Call(create, addr1, contract.ToBytes(initialSupply), []byte{})
	s.NoError(err)
	_, _, err = s.Call(addToWhitelist, addr1, []byte(addr2))
	s.NoError(err)

	id := contract.ToBytes(uint64(1))
	v := uint64(20)
	_, evs, err := s.Call(transfer, addr1, id, []byte(addr2), contract.ToBytes(v))
	s.NoError(err)
	s.Equal(1, len(evs))
	s.Equal(EventNameTransfer, evs[0].Type)
	s.Equal([]byte("from"), evs[0].Attributes[0].Key)
	s.Equal([]byte("to"), evs[0].Attributes[1].Key)
	s.Equal([]byte("tokenID"), evs[0].Attributes[2].Key)
	s.Equal([]byte("value"), evs[0].Attributes[3].Key)
	s.Equal([]byte(addr1), evs[0].Attributes[0].Value)
	s.Equal([]byte(addr2), evs[0].Attributes[1].Value)
	s.Equal([]byte("1"), evs[0].Attributes[2].Value)
	s.Equal([]byte("20"), evs[0].Attributes[3].Value)

	vb, _, err := s.Call(balanceOf, addr1, []byte(addr2), id)
	s.Equal(v, contract.UInt64(vb))

	vb, _, err = s.Call(balanceOf, addr1, []byte(addr1), id)
	s.Equal(uint64(80), contract.UInt64(vb))
}

func (s *EstateTestSuite) TestTransfer_OverOwnerCount() {
	_, _, err := s.Call(create, addr1, contract.ToBytes(uint64(100)), []byte{})
	s.NoError(err)
	_, _, err = s.Call(addToWhitelist, addr1, []byte(addr2))
	s.NoError(err)
	_, _, err = s.Call(addToWhitelist, addr1, []byte(addr3))
	s.NoError(err)
	_, _, err = s.Call(addToWhitelist, addr1, []byte(addr4))
	s.NoError(err)

	id := contract.ToBytes(uint64(1))
	v := uint64(10)
	_, _, err = s.Call(mint, addr1, id, []byte(addr2), contract.ToBytes(v))
	s.NoError(err)
	_, _, err = s.Call(mint, addr1, id, []byte(addr3), contract.ToBytes(v))
	s.NoError(err)
	_, _, err = s.Call(mint, addr1, id, []byte(addr4), contract.ToBytes(v))
	s.Error(err)
}

// getCreator() is not exported
func (s *EstateTestSuite) Test_getCreator() {
	creator, _ := sdk.AccAddressFromBech32(addr1)
	tokenID := uint64(0)
	setCreator(creator, tokenID, s.Store)
	actual := getCreator(tokenID, s.Store)
	s.Equal(creator, actual)
}

func TestEstateTestSuite(t *testing.T) {
	suite.Run(t, new(EstateTestSuite))
}

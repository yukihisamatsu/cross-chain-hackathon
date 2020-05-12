package coinchain

import (
	"testing"

	"github.com/datachainlab/cross/x/ibc/contract"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/testutil"
	"github.com/stretchr/testify/suite"
)

var (
	addr1 = "cosmos1j42p6wpqwgw8tcyk44vdkyywa0d4qhk2f7kv73"
	addr2 = "cosmos1fl8s5ea88asrw0rewzgkwrsm2w8r54j43e6hqz"
)

type DccTestSuite struct {
	testutil.BaseTestSuite
}

func (s *DccTestSuite) TestMint() {
	v := uint64(100)
	_, evs, err := s.Call(mint, addr1, []byte(addr2), contract.ToBytes(v))
	s.NoError(err)
	s.Equal(1, len(evs))
	s.Equal(EventNameTransfer, evs[0].Type)

	vb, _, err := s.Call(balanceOf, addr1, []byte(addr2))
	s.Equal(v, contract.UInt64(vb))

	vb, _, err = s.Call(totalSupply, addr1)
	s.Equal(v, contract.UInt64(vb))
}

func (s *DccTestSuite) TestTransfer() {
	_, _, err := s.Call(mint, addr1, []byte(addr1), contract.ToBytes(uint64(100)))
	s.NoError(err)

	v := uint64(20)
	_, evs, err := s.Call(transfer, addr1, []byte(addr2), contract.ToBytes(v))
	s.Equal(1, len(evs))
	s.Equal(EventNameTransfer, evs[0].Type)

	vb, _, err := s.Call(balanceOf, addr2, []byte(addr2))
	s.Equal(v, contract.UInt64(vb))

	vb, _, err = s.Call(balanceOf, addr1, []byte(addr1))
	s.Equal(uint64(80), contract.UInt64(vb))
}

func TestDccTestSuite(t *testing.T) {
	suite.Run(t, new(DccTestSuite))
}

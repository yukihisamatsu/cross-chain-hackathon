package coinchain

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
	addr3 = "cosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4"
	addr4 = "cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4"
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

func (s *DccTestSuite) TestTransferBatch() {
	_, _, err := s.Call(mint, addr1, []byte(addr1), contract.ToBytes(uint64(100)))
	s.NoError(err)

	tos := []byte("cosmos1fl8s5ea88asrw0rewzgkwrsm2w8r54j43e6hqzcosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4")
	vs := []byte{
		0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 0, 2,
		0, 0, 0, 0, 0, 0, 0, 3,
	}
	_, evs, err := s.Call(transferBatch, addr1, tos, vs)
	s.Equal(3, len(evs))
	s.Equal(EventNameTransfer, evs[0].Type)
	s.Equal([]byte(addr2), evs[0].Attributes[1].Value)
	s.Equal([]byte(addr3), evs[1].Attributes[1].Value)
	s.Equal([]byte(addr4), evs[2].Attributes[1].Value)

	vb, _, err := s.Call(balanceOf, addr2, []byte(addr2))
	s.Equal(uint64(1), contract.UInt64(vb))
	vb, _, err = s.Call(balanceOf, addr3, []byte(addr3))
	s.Equal(uint64(2), contract.UInt64(vb))
	vb, _, err = s.Call(balanceOf, addr4, []byte(addr4))
	s.Equal(uint64(3), contract.UInt64(vb))
	vb, _, err = s.Call(balanceOf, addr1, []byte(addr1))
	s.Equal(uint64(94), contract.UInt64(vb))
}

func (s *DccTestSuite) TestSplitUint64s() {
	in := []byte{
		0, 0, 0, 0, 0, 0, 0, 1,
		0, 0, 0, 0, 0, 0, 39, 16,
		0, 0, 0, 0, 0, 15, 76, 4,
		0, 0, 0, 0, 0, 0, 0, 0,
	}
	res, err := splitUInt64s(in)
	s.NoError(err)
	s.Equal(4, len(res))
	s.Equal(uint64(1), res[0])
	s.Equal(uint64(10000), res[1])
	s.Equal(uint64(1002500), res[2])
	s.Equal(uint64(0), res[3])
}

func (s *DccTestSuite) TestSplitAddrs() {
	in := []byte("cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02cosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4")
	res, err := splitAddrs(in)
	s.NoError(err)
	s.Equal(3, len(res))

	addr1, _ := sdk.AccAddressFromBech32("cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02")
	addr2, _ := sdk.AccAddressFromBech32("cosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4")
	addr3, _ := sdk.AccAddressFromBech32("cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4")

	s.Equal(addr1, res[0])
	s.Equal(addr2, res[1])
	s.Equal(addr3, res[2])
}

func TestDccTestSuite(t *testing.T) {
	suite.Run(t, new(DccTestSuite))
}

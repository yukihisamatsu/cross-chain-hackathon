package securitychain

import (
	"fmt"
	"testing"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/testutil"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/stretchr/testify/suite"
)

type DividendTestSuite struct {
	testutil.BaseTestSuite
	tokenID    uint64
	perShare   uint64
	initSupply uint64
	initShare  uint64
}

func (s *DividendTestSuite) SetupTest() {
	s.Store = testutil.NewMockStore()
	// init estate data
	s.Call(create, addr1, contract.ToBytes(s.initSupply), []byte{})

	// add whitelist
	s.Call(addToWhitelist, addr1, []byte(addr2))
	s.Call(addToWhitelist, addr1, []byte(addr3))
	s.Call(addToWhitelist, addr1, []byte(addr4))

	id := contract.ToBytes(s.tokenID)
	s.Call(transfer, addr1, id, []byte(addr2), contract.ToBytes(s.initShare))
	s.Call(transfer, addr1, id, []byte(addr3), contract.ToBytes(s.initShare))
}

func (s *DividendTestSuite) TestRegisterDividend() {
	_, evs, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)
	s.Equal(1, len(evs))
	s.Equal(EventNameDividendRegistered, evs[0].Type)
	s.Equal([]byte("tokenID"), evs[0].Attributes[0].Key)
	s.Equal([]byte("1"), evs[0].Attributes[0].Value)
	s.Equal([]byte("index"), evs[0].Attributes[1].Key)
	s.Equal([]byte("1"), evs[0].Attributes[1].Value)
	s.Equal([]byte("perShare"), evs[0].Attributes[2].Key)
	s.Equal([]byte(fmt.Sprintf("%d", s.perShare)), evs[0].Attributes[2].Value)

	idxB, _, err := s.Call(dividendIndexOf, addr1, contract.ToBytes(s.tokenID))
	s.NoError(err)
	s.Equal(uint64(1), contract.UInt64(idxB))

	isPaid, _, err := s.Call(isDividendPaid, addr1, contract.ToBytes(s.tokenID), idxB)
	s.NoError(err)
	s.False(contract.Bool(isPaid))

	dividend, _, err := s.Call(dividendOf, addr1, []byte(addr2), contract.ToBytes(s.tokenID))
	s.NoError(err)
	expected := s.initShare * s.perShare
	s.Equal(expected, contract.UInt64(dividend))
}

func (s *DividendTestSuite) TestRegisterDividend_NotCreator() {
	_, _, err := s.Call(registerDividend, addr2, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.Error(err)
}

func (s *DividendTestSuite) TestRegisterDividend_Duplication() {
	_, _, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)

	_, _, err = s.Call(registerDividend, addr2, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.Error(err)
}

func (s *DividendTestSuite) TestDividendOf_WithTransfer() {
	_, _, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)

	// This should not affect the dividend
	_, _, err = s.Call(transfer, addr2, contract.ToBytes(s.tokenID), []byte(addr3), contract.ToBytes(uint64(5)))
	s.NoError(err)

	expected := s.initShare * s.perShare

	dividend, _, err := s.Call(dividendOf, addr1, []byte(addr2), contract.ToBytes(s.tokenID))
	s.NoError(err)
	s.Equal(expected, contract.UInt64(dividend))

	dividend, _, err = s.Call(dividendOf, addr1, []byte(addr3), contract.ToBytes(s.tokenID))
	s.NoError(err)
	s.Equal(expected, contract.UInt64(dividend))
}

func (s *DividendTestSuite) TestDividendOf_WithMint() {
	_, _, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)

	/* These should not affect the dividend */
	_, _, err = s.Call(mint, addr1, contract.ToBytes(s.tokenID), []byte(addr2), contract.ToBytes(uint64(5)))
	s.NoError(err)
	// addr3: 20 -> 0, addr4: 0 -> 20
	_, _, err = s.Call(transfer, addr3, contract.ToBytes(s.tokenID), []byte(addr4), contract.ToBytes(uint64(20)))
	s.NoError(err)

	dividend, _, err := s.Call(dividendOf, addr1, []byte(addr2), contract.ToBytes(s.tokenID))
	s.NoError(err)
	expected := s.initShare * s.perShare
	s.Equal(expected, contract.UInt64(dividend))

	dividend, _, err = s.Call(dividendOf, addr1, []byte(addr3), contract.ToBytes(s.tokenID))
	s.NoError(err)
	s.Equal(expected, contract.UInt64(dividend))

	dividend, _, err = s.Call(dividendOf, addr1, []byte(addr4), contract.ToBytes(s.tokenID))
	s.NoError(err)
	s.Equal(uint64(0), contract.UInt64(dividend))
}

func (s *DividendTestSuite) TestPayDividend() {
	_, _, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)

	idxB := contract.ToBytes(uint64(1))
	_, evs, err := s.Call(payDividend, addr1, contract.ToBytes(s.tokenID), idxB)
	s.NoError(err)
	s.Equal(1, len(evs))
	s.Equal(EventNameDividendPaid, evs[0].Type)
	s.Equal([]byte("tokenID"), evs[0].Attributes[0].Key)
	s.Equal([]byte("1"), evs[0].Attributes[0].Value)
	s.Equal([]byte("index"), evs[0].Attributes[1].Key)
	s.Equal([]byte("1"), evs[0].Attributes[1].Value)

	isPaid, _, err := s.Call(isDividendPaid, addr1, contract.ToBytes(s.tokenID), idxB)
	s.NoError(err)
	s.True(contract.Bool(isPaid))
}

func (s *DividendTestSuite) TestPayDividend_NotRegistered() {
	idxB := contract.ToBytes(uint64(1))
	_, _, err := s.Call(payDividend, addr1, contract.ToBytes(s.tokenID), idxB)
	s.Error(err)
}

func (s *DividendTestSuite) TestRegisterDividend_AnotherOne() {
	_, _, err := s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)
	_, _, err = s.Call(payDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(uint64(1)))
	s.NoError(err)

	// This affects the dividend
	diff := uint64(5)
	_, _, err = s.Call(transfer, addr2, contract.ToBytes(s.tokenID), []byte(addr3), contract.ToBytes(diff))
	s.NoError(err)

	_, _, err = s.Call(registerDividend, addr1, contract.ToBytes(s.tokenID), contract.ToBytes(s.perShare))
	s.NoError(err)

	// This returns the dividend of index 2
	dividend, _, err := s.Call(dividendOf, addr1, []byte(addr2), contract.ToBytes(s.tokenID))
	s.NoError(err)
	expected := (s.initShare - diff) * s.perShare
	s.Equal(expected, contract.UInt64(dividend))
}

func TestDividendTestSuite(t *testing.T) {
	dts := new(DividendTestSuite)
	dts.tokenID = uint64(1)
	dts.perShare = uint64(3)
	dts.initSupply = uint64(100)
	dts.initShare = uint64(20)
	suite.Run(t, dts)
}

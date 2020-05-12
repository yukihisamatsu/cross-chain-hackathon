package common

import (
	"testing"

	"github.com/datachainlab/cross-chain-hackathon/contract/simapp/testutil"
	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/stretchr/testify/suite"
)

type CommonTestSuite struct {
	testutil.BaseTestSuite
}

func (s *CommonTestSuite) TestGetUInt64() {
	key := []byte("sample")
	val := uint64(10)
	s.Store.Set(key, contract.ToBytes(val))

	s.Equal(val, GetUInt64(key, s.Store))
}

func (s *CommonTestSuite) TestGetBool() {
	key := []byte("sample")
	val := true
	s.Store.Set(key, contract.ToBytes(val))

	s.Equal(val, GetBool(key, s.Store))
}

// In order for 'go test' to run this suite, we need to create
// a normal test function and pass our suite to suite.Run
func TestCommonTestSuite(t *testing.T) {
	suite.Run(t, new(CommonTestSuite))
}

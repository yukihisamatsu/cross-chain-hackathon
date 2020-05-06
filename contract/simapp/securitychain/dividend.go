package securitychain

import (
	"fmt"

	"github.com/datachainlab/cross/x/ibc/contract"
	"github.com/datachainlab/cross/x/ibc/cross"
)

// addDividendPerShare(uint256 _tokenId, uint256 _perShare) public returns (uint256 _dividendId)
func addDividendPerShare(ctx contract.Context, store cross.Store) ([]byte, error) {
	return nil, ErrorNotImplemented
}

// payDividend(uint256 _tokenId, uint256 _dividendId) public returns (bool)
func payDividend(ctx contract.Context, store cross.Store) ([]byte, error) {
	return nil, ErrorNotImplemented
}

// dividendOf(uint256 _tokenId, uint256 _dividendId) public returns
func dividendOf(ctx contract.Context, store cross.Store) ([]byte, error) {
	return nil, ErrorNotImplemented
}

func makeDividendKey(addr []byte, by []byte) []byte {
	return []byte(fmt.Sprintf("whitelist/%v/by/%v", addr, by))
}

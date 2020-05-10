/*
 * cross-chain-hackathon api
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package api

import (
	"encoding/binary"
	"fmt"
	"log"
	"strconv"

	"github.com/datachainlab/cross-chain-hackathon/backend/apiserver/rdb"
	"github.com/datachainlab/cross/x/ibc/contract/types"
)

const (
	CO_CHAIN_ID       = "ibc0"
	TYPE_CROSS_TX     = "cosmos-sdk/StdTx"
	TYPE_MSG_INITIATE = "cross/MsgInitiate"

	KEY_COIN        = "coin"
	KEY_COORDINATOR = "coordinator"
	KEY_SECURITY    = "security"
	KEY_CO_COIN     = "coordinator-coin"
	KEY_CO_SECURITY = "coordinator-security"
)

// TxApiService is a service that implents the logic for the TxApiServicer
// This service should implement the business logic for every endpoint for the TxApi API.
// Include any external packages or services that will be required by this service.
type TxApiService struct {
	config Config
}

// NewTxApiService creates a default api service
func NewTxApiService(config Config) TxApiServicer {
	return &TxApiService{config}
}

// TODO impl or remove
// TxDividendGet - get a CrossTx to be signed
func (s *TxApiService) TxDividendGet(estateId string, perShare int64) (interface{}, error) {
	return nil, fmt.Errorf("TODO not implemented")
}

// TxTradeRequestGet - get a CrossTx to be signed
func (s *TxApiService) TxTradeRequestGet(tradeId int64, from string) (interface{}, error) {
	// first, get TradeRequest info from db.
	db, err := rdb.InitDB()
	if err != nil {
		log.Println(err)
		return nil, ErrorFailedDBConnect
	}
	t := Trade{}
	q := `SELECT id, estateId, unitPrice, amount, seller, status FROM trade WHERE id = ?`
	row := db.QueryRow(q, tradeId)
	if err := row.Scan(&t.Id, &t.EstateId, &t.UnitPrice, &t.Amount, &t.Seller, &t.Status); err != nil {
		log.Println(err)
		return nil, ErrorFailedDBGet
	}
	if t.Status != TRADE_OPENED {
		return nil, ErrorWrongStatus
	}

	cross := NewCross()
	simCoin, err := cross.SimulateContractCall(
		from,
		genCoinTransferCallInfo(s.config, t.Seller, uint64(t.UnitPrice*t.Amount)),
		s.config.Node[KEY_COIN],
	)
	if err != nil {
		return nil, err
	}
	tokenId, err := stringToUint64(t.EstateId)
	if err != nil {
		return nil, err
	}
	simSecurity, err := cross.SimulateContractCall(
		t.Seller,
		genEstateTransferCallInfo(s.config, tokenId, from, uint64(t.Amount)),
		s.config.Node[KEY_SECURITY],
	)
	if err != nil {
		return nil, err
	}

	// sender is the seller
	crossTx, err := cross.GenerateMsgInitiate(
		t.Seller,
		[]ChannelInfo{s.config.Path[KEY_CO_COIN], s.config.Path[KEY_CO_SECURITY]},
		[]ContractCallResult{*simCoin, *simSecurity},
		s.config.Node[KEY_COORDINATOR],
	)
	if err != nil {
		return nil, err
	}
	return &crossTx, nil
}

func genCoinTransferCallInfo(c Config, to string, amount uint64) types.ContractCallInfo {
	return types.ContractCallInfo{
		c.Contract[KEY_COIN].Id,
		"transfer",
		[][]byte{
			[]byte(to),
			uint64ToByte(amount),
		},
	}
}

func genEstateTransferCallInfo(c Config, tokenId uint64, to string, amount uint64) types.ContractCallInfo {
	return types.ContractCallInfo{
		c.Contract[KEY_SECURITY].Id,
		"transfer",
		[][]byte{
			uint64ToByte(tokenId),
			[]byte(to),
			uint64ToByte(amount),
		},
	}
}

// HACK
// this needs for the type mismatch between contract tokenId(uint64) and model schema(string)
func stringToUint64(str string) (uint64, error) {
	return strconv.ParseUint(str, 10, 64)
}

func uint64ToByte(v uint64) []byte {
	var bz [8]byte
	binary.BigEndian.PutUint64(bz[:], v)
	//str := base64.StdEncoding.EncodeToString(bz[:])
	return bz[:]
}

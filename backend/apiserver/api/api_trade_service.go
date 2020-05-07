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
	"errors"
)

// TradeApiService is a service that implents the logic for the TradeApiServicer
// This service should implement the business logic for every endpoint for the TradeApi API. 
// Include any external packages or services that will be required by this service.
type TradeApiService struct {
}

// NewTradeApiService creates a default api service
func NewTradeApiService() TradeApiServicer {
	return &TradeApiService{}
}

// DeleteTrade - cancel a trade
func (s *TradeApiService) DeleteTrade(id int64) (interface{}, error) {
	// TODO - update DeleteTrade with the required logic for this service method.
	// Add api_trade_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'DeleteTrade' not implemented")
}

// DeleteTradeRequest - cancel a trade request
func (s *TradeApiService) DeleteTradeRequest(id int64) (interface{}, error) {
	// TODO - update DeleteTradeRequest with the required logic for this service method.
	// Add api_trade_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'DeleteTradeRequest' not implemented")
}

// PostTrade - post a new sell offer
func (s *TradeApiService) PostTrade(trade Trade) (interface{}, error) {
	// TODO - update PostTrade with the required logic for this service method.
	// Add api_trade_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'PostTrade' not implemented")
}

// PostTradeRequest - post a new trade request
func (s *TradeApiService) PostTradeRequest(postTradeRequestInput PostTradeRequestInput) (interface{}, error) {
	// TODO - update PostTradeRequest with the required logic for this service method.
	// Add api_trade_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'PostTradeRequest' not implemented")
}

// TxTradeRequestGet - get a CrossTx to be signed
func (s *TradeApiService) TxTradeRequestGet(tradeId int64, from string) (interface{}, error) {
	// TODO - update TxTradeRequestGet with the required logic for this service method.
	// Add api_trade_service.go to the .openapi-generator-ignore to avoid overwriting this service implementation when updating open api generation.
	return nil, errors.New("service method 'TxTradeRequestGet' not implemented")
}

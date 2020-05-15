/*
 * cross-chain-hackathon api
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package api

type Dividend struct {

	// for primary key
	Id int64 `json:"id"`

	EstateId string `json:"estateId"`

	// this is determined by the contract
	Index int64 `json:"index,omitempty"`

	PerShare int64 `json:"perShare"`

	CrossTx CrossTx `json:"crossTx"`

	Status DividendStatus `json:"status"`
}

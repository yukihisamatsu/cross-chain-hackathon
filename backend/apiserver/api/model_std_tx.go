/*
 * cross-chain-hackathon api
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package api

// StdTx - same as cosmos sdk
type StdTx struct {

	Msg []Msg `json:"msg"`

	Fee StdFee `json:"fee"`

	Signatures []StdSignature `json:"signatures,omitempty"`

	Memo string `json:"memo"`
}

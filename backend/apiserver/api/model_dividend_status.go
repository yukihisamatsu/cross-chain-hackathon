/*
 * cross-chain-hackathon api
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package api

type DividendStatus int32

// List of DividendStatus
const (
	DIVIDEND_REGISTERED DividendStatus = 0
	DIVIDEND_ONGOING DividendStatus = 1
	DIVIDEND_COMPLETED DividendStatus = 2
	DIVIDEND_FAILED DividendStatus = 3
)

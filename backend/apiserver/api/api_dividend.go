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
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// A DividendApiController binds http requests to an api service and writes the service results to the http response
type DividendApiController struct {
	service DividendApiServicer
}

// NewDividendApiController creates a default api controller
func NewDividendApiController(s DividendApiServicer) Router {
	return &DividendApiController{service: s}
}

// Routes returns all of the api route for the DividendApiController
func (c *DividendApiController) Routes() Routes {
	return Routes{
		{
			"GetDividendsByEstateId",
			strings.ToUpper("Get"),
			"/api/dividends/{estateId}",
			c.GetDividendsByEstateId,
		},
	}
}

// GetDividendsByEstateId - get the dividends of an estate token
func (c *DividendApiController) GetDividendsByEstateId(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	estateId := params["estateId"]
	result, err := c.service.GetDividendsByEstateId(estateId)
	if err != nil {
		w.WriteHeader(HttpStatus(err))
		return
	}

	EncodeJSONResponse(result, nil, w)
}

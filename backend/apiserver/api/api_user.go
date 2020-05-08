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

// A UserApiController binds http requests to an api service and writes the service results to the http response
type UserApiController struct {
	service UserApiServicer
}

// NewUserApiController creates a default api controller
func NewUserApiController(s UserApiServicer) Router {
	return &UserApiController{service: s}
}

// Routes returns all of the api route for the UserApiController
func (c *UserApiController) Routes() Routes {
	return Routes{
		{
			"GetUser",
			strings.ToUpper("Get"),
			"/api/user/{id}",
			c.GetUser,
		},
		{
			"GetUsers",
			strings.ToUpper("Get"),
			"/api/users",
			c.GetUsers,
		},
	}
}

// GetUser - get user information
func (c *UserApiController) GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id := params["id"]
	result, err := c.service.GetUser(id)
	if err != nil {
		w.WriteHeader(HttpStatus(err))
		return
	}

	EncodeJSONResponse(result, nil, w)
}

// GetUsers - get all users
func (c *UserApiController) GetUsers(w http.ResponseWriter, r *http.Request) {
	result, err := c.service.GetUsers()
	if err != nil {
		w.WriteHeader(HttpStatus(err))
		return
	}

	EncodeJSONResponse(result, nil, w)
}

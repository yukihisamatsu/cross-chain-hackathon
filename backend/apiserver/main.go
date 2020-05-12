/*
 * cross-chain-hackathon api
 *
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * API version: 1.0.0
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package main

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/spf13/viper"

	api "github.com/datachainlab/cross-chain-hackathon/backend/apiserver/api"
)

func initConfig() *viper.Viper {
	v := viper.New()
	v.SetConfigName("config") // name of config file (without extension)
	v.SetConfigType("yaml")   // REQUIRED if the config file does not have the extension in the name
	v.AddConfigPath(".")
	v.AddConfigPath("/root/api")

	// v.Unmarshal(&C) doesn't work well with env.
	// cf. https://github.com/spf13/viper/issues/188#issuecomment-255519149
	//v.AutomaticEnv()
	//v.SetEnvPrefix("API")
	//replacer := strings.NewReplacer("-", "_")
	//v.SetEnvKeyReplacer(replacer)
	//v.Bind("BLABLABLA")

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Fatal("config not found")
		} else {
			log.Fatalln("viper config error")
		}
	}
	return v
}

func main() {
	v := initConfig()
	config, err := api.NewConfigFromViper(v)
	if err != nil {
		log.Fatal("can't parse config")
	}
	log.Printf("loaded config: %+v\n", config)
	log.Printf("Server started")

	EstateApiService := api.NewEstateApiService()
	EstateApiController := api.NewEstateApiController(EstateApiService)

	TradeApiService := api.NewTradeApiService()
	TradeApiController := api.NewTradeApiController(TradeApiService)

	TxApiService := api.NewTxApiService(*config)
	TxApiController := api.NewTxApiController(TxApiService)

	UserApiService := api.NewUserApiService()
	UserApiController := api.NewUserApiController(UserApiService)

	router := api.NewRouter(EstateApiController, TradeApiController, TxApiController, UserApiController)
	handler := handlers.CORS(handlers.AllowedHeaders([]string{"Content-Type"}),
		handlers.AllowCredentials())(router)
	log.Fatal(http.ListenAndServe(":8000", handler))
}

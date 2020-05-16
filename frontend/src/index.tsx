import "antd/dist/antd.css";

import log, {LogLevelDesc} from "loglevel";
import React from "react";
import ReactDOM from "react-dom";

import {Root} from "~pages/root";
import {createApiClient} from "~src/heplers/api-client";
import {parseEnv} from "~src/heplers/config";
import {CoinContract} from "~src/libs/cosmos/contract/coin";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {RestClient} from "~src/libs/cosmos/rest-client";
import {DividendRepository} from "~src/repos/dividend";
import {EstateRepository} from "~src/repos/estate";
import {OrderRepository} from "~src/repos/order";
import {Repositories} from "~src/repos/types";
import {UserRepository} from "~src/repos/user";

(async () => {
  const config = parseEnv();
  const logLevel: LogLevelDesc = config.env === "production" ? "warn" : "debug";
  log.setLevel(logLevel);
  const {dividendApi, estateApi, tradeApi, txApi, userApi} = createApiClient({
    basePath: config.apiEndPoint
  });

  const coinRestClient = new RestClient(config.coinRESTEndPoint);
  const securityRestClient = new RestClient(config.securityRESTEndPoint);
  const coordinatorRestClient = new RestClient(config.coordinatorRESTEndPoint);

  const estateContract = new EstateContract({securityRestClient});
  const coinContract = new CoinContract({coinRestClient});

  const repos: Repositories = {
    dividendRepo: DividendRepository.create({
      dividendApi,
      estateApi,
      estateContract,
      securityRestClient
    }),
    estateRepo: EstateRepository.create({
      estateApi,
      tradeApi,
      userApi,
      estateContract,
      securityRestClient
    }),
    orderRepo: OrderRepository.create({
      tradeApi,
      txApi,
      coordinatorRestClient
    }),
    userRepo: UserRepository.create({
      userApi,
      coinContract,
      coordinatorRestClient,
      securityRestClient
    })
  };

  document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
      <Root config={config} repos={repos} />,
      document.getElementById("root")
    );
  });
})();

import "antd/dist/antd.css";

import log, {LogLevelDesc} from "loglevel";
import React from "react";
import ReactDOM from "react-dom";

import {Root} from "~pages/root";
import {createApiClient} from "~src/heplers/api-client";
import {parseEnv} from "~src/heplers/config";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {RestClient} from "~src/libs/cosmos/rest-client";
import {RPCClient} from "~src/libs/cosmos/rpc-client";
import {EstateRepository} from "~src/repos/estate";
import {Repositories} from "~src/repos/types";
import {UserRepository} from "~src/repos/user";

(async () => {
  const config = parseEnv();
  const logLevel: LogLevelDesc = config.env === "production" ? "warn" : "debug";
  log.setLevel(logLevel);
  const {estateApi, tradeApi, userApi} = createApiClient({
    basePath: config.apiEndPoint
  });

  const coinRPCClient = new RPCClient(config.coinRPCEndPoint);
  const securityRPCClient = new RPCClient(config.securityRPCEndPoint);
  // const coordinatorRPCClient = new RPCClient(config.coordinatorRPCEndPoint);

  // const coinRestClient = new RestClient(config.coinRESTEndPoint);
  const securityRestClient = new RestClient(config.securityRESTEndPoint);
  // const coordinatorRestClient = new RestClient(config.coordinatorRESTEndPoint);

  const estateContract = new EstateContract({securityRestClient});

  const repos: Repositories = {
    userRepo: UserRepository.create({
      userApi,
      coinRPCClient,
      securityRPCClient
    }),

    estateRepo: EstateRepository.create({
      estateApi,
      tradeApi,
      estateContract
    })
  };

  document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
      <Root config={config} repos={repos} />,
      document.getElementById("root")
    );
  });
})();

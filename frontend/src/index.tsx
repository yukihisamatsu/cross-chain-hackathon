import "antd/dist/antd.css";

import React from "react";
import ReactDOM from "react-dom";

import {Root} from "~pages/root";
import {createApiClient} from "~src/heplers/api-client";
import {parseEnv} from "~src/heplers/config";
import {RPCClient} from "~src/libs/cosmos/rpc-client";
import {EstateRepository} from "~src/repos/estate";
import {Repositories} from "~src/repos/types";
import {UserRepository} from "~src/repos/user";

(async () => {
  const config = parseEnv();
  const {estateApi, tradeApi, userApi} = createApiClient({
    basePath: config.apiEndPoint
  });

  const coinRPCClient = new RPCClient(config.coinEndPoint);
  const securityRPCClient = new RPCClient(config.securityEndPoint);
  const coordinatorRPCClient = new RPCClient(config.coordinatorEndPoint);

  const repos: Repositories = {
    userRepo: UserRepository.create({
      userApi,
      coinRPCClient,
      securityRPCClient
    }),
    estateRepo: EstateRepository.create({
      estateApi,
      tradeApi,
      coinRPCClient,
      securityRPCClient,
      coordinatorRPCClient
    })
  };

  document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
      <Root config={config} repos={repos} />,
      document.getElementById("root")
    );
  });
})();

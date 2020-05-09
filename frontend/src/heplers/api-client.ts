import {
  Configuration,
  ConfigurationParameters,
  EstateApi,
  TradeApi,
  TxApi,
  UserApi
} from "~src/libs/api";

export const createApiClient = (params: ConfigurationParameters) => {
  const config = new Configuration(params);
  const estateApi = new EstateApi(config);
  const tradeApi = new TradeApi(config);
  const txApi = new TxApi(config);
  const userApi = new UserApi(config);

  return {
    estateApi,
    tradeApi,
    txApi,
    userApi
  };
};

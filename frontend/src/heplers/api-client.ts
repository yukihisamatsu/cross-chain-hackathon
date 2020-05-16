import {
  Configuration,
  ConfigurationParameters,
  DividendApi,
  EstateApi,
  TradeApi,
  TxApi,
  UserApi
} from "~src/libs/api";

export const createApiClient = (params: ConfigurationParameters) => {
  const config = new Configuration(params);
  const dividendApi = new DividendApi(config);
  const estateApi = new EstateApi(config);
  const tradeApi = new TradeApi(config);
  const txApi = new TxApi(config);
  const userApi = new UserApi(config);

  return {
    dividendApi,
    estateApi,
    tradeApi,
    txApi,
    userApi
  };
};

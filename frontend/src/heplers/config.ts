type Env = "development" | "production";

export interface Config {
  apiEndPoint: string;
  coordinatorRPCEndPoint: string;
  coordinatorRESTEndPoint: string;
  securityRPCEndPoint: string;
  securityRESTEndPoint: string;
  coinRPCEndPoint: string;
  coinRESTEndPoint: string;
  env: Env;
}

const productionBaseURL =
  "http://cch-alb-prod-295901909.us-east-1.elb.amazonaws.com";
const localBaseURL = "http://localhost";

export const createConfig = (): Config => {
  let env: Env;
  if (process.env.NODE_ENV === "production") {
    env = "production";
  } else {
    env = "development";
  }

  const baseURL = env === "production" ? productionBaseURL : localBaseURL;

  // API server Endpoints
  const apiEndPoint = `${baseURL}:8080/api`;

  // RPC Endpoints
  const coordinatorRPCEndPoint = `${baseURL}:26657`;
  const securityRPCEndPoint = `${baseURL}:26660`;
  const coinRPCEndPoint = `${baseURL}:26662`;

  // REST Endpoints
  const coordinatorRESTEndPoint = `${baseURL}:1317`;
  const securityRESTEndPoint = `${baseURL}:1318`;
  const coinRESTEndPoint = `${baseURL}:1319`;

  return {
    env,
    apiEndPoint,
    coordinatorRPCEndPoint,
    coordinatorRESTEndPoint,
    securityRPCEndPoint,
    securityRESTEndPoint,
    coinRPCEndPoint,
    coinRESTEndPoint
  };
};

// const guard = (env: string | undefined, key: string): string => {
//   if (!env) {
//     throw new Error(`not exits: ENV: ${key}`);
//   }
//   return env;
// };

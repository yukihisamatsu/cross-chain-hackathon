type Env = "development" | "production";

export interface Config {
  apiEndPoint: string;
  coordinatorEndPoint: string;
  securityEndPoint: string;
  coinEndPoint: string;
  env: Env;
}

const productionBaseURL =
  "http://cch-alb-prod-295901909.us-east-1.elb.amazonaws.com";
const localBaseURL = "http://localhost";

export const parseEnv = (): Config => {
  let env: Env;
  if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    env = "production";
  } else {
    env = "development";
  }

  const apiEndPoint =
    env === "production"
      ? `${productionBaseURL}:8080/api`
      : `${localBaseURL}:8080/api`;

  const coordinatorEndPoint =
    env === "production" ? `${productionBaseURL}:` : `${localBaseURL}:26657`;

  const securityEndPoint =
    env === "production" ? `${productionBaseURL}:` : `${localBaseURL}:26660`;

  const coinEndPoint =
    env === "production" ? `${productionBaseURL}:` : `${localBaseURL}:26662`;

  return {
    env,
    apiEndPoint,
    coordinatorEndPoint,
    securityEndPoint,
    coinEndPoint
  };
};

// const guard = (env: string | undefined, key: string): string => {
//   if (!env) {
//     throw new Error(`not exits: ENV: ${key}`);
//   }
//   return env;
// };

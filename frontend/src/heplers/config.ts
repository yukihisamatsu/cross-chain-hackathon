import {isHttpsUri, isHttpUri} from "valid-url";

type Env = "development" | "production";

export interface Config {
  apiEndPoint: string;
  env: Env;
}

export const parseEnv = (): Config => {
  const apiEndPoint = guard(process.env.API_END_POINT, "API_END_POINT");
  if (!(isHttpUri(apiEndPoint) || isHttpsUri(apiEndPoint))) {
    throw new Error(`invalid API endpoint: ${apiEndPoint}`);
  }

  let env: Env;
  if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    env = "production";
  } else {
    env = "development";
  }

  return {
    apiEndPoint,
    env
  };
};

const guard = (env: string | undefined, key: string): string => {
  if (!env) {
    throw new Error(`not exits: ENV: ${key}`);
  }
  return env;
};

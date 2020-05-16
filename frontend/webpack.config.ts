import path from "path";
import {
  Configuration,
  DefinePlugin,
  Module,
  Options,
  Plugin,
  ProgressPlugin,
  RuleSetRule
} from "webpack";
import * as DevServer from "webpack-dev-server";

const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const ENV: "production" | "development" = process.env.ENV
  ? "production"
  : "development";

const PATH = {
  app: `${__dirname}/src/index.tsx`,
  dist: `${__dirname}/dist`
};

const rules: RuleSetRule[] = [
  {
    enforce: "pre",
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: "eslint-loader"
  },
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
    options: {
      configFile: "tsconfig.webpack.json"
    }
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: "style-loader",
        options: {
          insert: function insertAtTop(element: HTMLElement) {
            const parent = document.querySelector("head");
            if (!parent) {
              return;
            }

            const lastInsertedElement = (window as any)
              ._lastElementInsertedByStyleLoader;

            if (!lastInsertedElement) {
              parent.insertBefore(element, parent.firstChild);
            } else if (lastInsertedElement.nextSibling) {
              parent.insertBefore(element, lastInsertedElement.nextSibling);
            } else {
              parent.appendChild(element);
            }

            (window as any)._lastElementInsertedByStyleLoader = element;
          }
        }
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: ENV !== "production"
        }
      }
    ],
    include: /node_modules/
  }
];

const modules: Module = {
  rules: rules
};

const plugins: Plugin[] = [
  new AntdDayjsWebpackPlugin(),
  new DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(ENV),
      API_END_POINT: JSON.stringify(process.env.API_END_POINT)
    }
  }),
  new ProgressPlugin((percentage, msg) => {
    const stream = process.stdout;
    if (!stream.isTTY) return;
    stream.cursorTo(0);
    stream.write(`${Math.floor(percentage * 100)}%: ${msg}`);
    stream.clearLine(1);
  })
];

const stats: Options.Stats = {
  colors: true,
  warningsFilter: ["Amino.js"]
};

const devServerConfig: DevServer.Configuration = {
  contentBase: `${__dirname}/public/`,
  host: "localhost",
  port: 4000,
  open: false,
  publicPath: "/",
  inline: true,
  hot: true,
  clientLogLevel: "info",
  historyApiFallback: true
};

const Config: Configuration = {
  watch: ENV !== "production",
  mode: ENV,
  devtool: ENV === "production" ? false : "inline-source-map",
  entry: {
    index: PATH.app
  },
  output: {
    filename: "[name].js",
    path: PATH.dist,
    publicPath: PATH.dist
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: "vendor",
          chunks: "initial",
          enforce: true
        }
      }
    }
  },
  plugins: plugins,
  module: modules,
  stats: stats,
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: ["node_modules"],
    alias: {
      "~src": path.resolve(__dirname, "src"),
      "~helpers": path.resolve(__dirname, "src/helpers"),
      "~models": path.resolve(__dirname, "src/models"),
      "~pages": path.resolve(__dirname, "src/pages"),
      "~tests": path.resolve(__dirname, "tests")
    }
  },
  devServer: devServerConfig
};

export default Config;

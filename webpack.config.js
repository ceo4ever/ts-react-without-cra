require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appIndex = path.resolve(__dirname, "src", "index.tsx");
const appHtml = path.resolve(__dirname, "public", "index.html");
const appBuild = path.resolve(__dirname, "build");
const appPublic = path.resolve(__dirname, "public");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

// function extractFromDotenv(str) {
//   const result = str
//     .match(/"REACT_APP[\w]{1,}":"[\w|\d|\s]{1,}",?/g)
//     .join("")
//     .split(/,$/)[0];
//   return JSON.parse(`{${result}}`);
// }
// new webpack.DefinePlugin({
//   "process.env": JSON.stringify(
//     Object.assign(extractFromDotenv(JSON.stringify(dotenv.parsed)), {
//       NODE_ENV: webpackEnv,
//     })
//   ),
// }),

function getClientEnv(nodeEnv) {
  return {
    "process.env": JSON.stringify(
      Object.keys(process.env)
        .filter((key) => /^REACT_APP/i.test(key))
        .reduce(
          (env, key) => {
            env[key] = process.env[key];
            return env;
          },
          { NODE_ENV: nodeEnv }
        )
    ),
  };
}

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const clientEnv = getClientEnv(webpackEnv);

  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: isEnvDevelopment ? true : false,
              },
            },
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: "url-loader",
          options: {
            limit: 10000,
            outputPath: "static/media",
            name: "[name].[hash:8].[ext]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: appHtml }),
      new webpack.DefinePlugin(clientEnv),
    ],
    devServer: {
      port: 3000,
      contentBase: appPublic,
      open: true,
      historyApiFallback: true,
      overlay: true,
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
  };
};

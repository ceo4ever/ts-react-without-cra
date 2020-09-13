const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  return {
    mode: webpackEnv,
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "static/js/[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
    devServer: {
      port: 3000,
      contentBase: path.join(__dirname, "public"),
      open: true,
      historyApiFallback: true,
      overlay: false,
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
  };
};

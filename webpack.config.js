require("dotenv").config();
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const appIndex = path.resolve(__dirname, "src", "index.tsx");
const appHtml = path.resolve(__dirname, "public", "index.html");
const appBuild = path.resolve(__dirname, "build");
const appPublic = path.resolve(__dirname, "public");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

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
          {
            NODE_ENV: nodeEnv,
          }
        )
    ),
  };
}

module.exports = (webpackEnv) => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const isBundleAnalyze = process.env.npm_lifecycle_event === "build:analyze";
  const clientEnv = getClientEnv(webpackEnv);

  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: "url-loader",
              options: {
                limit: 10000,
                outputPath: "static/media",
                name: "[name].[hash:8].[ext]",
              },
            },
            {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                "cache-loader",
                {
                  loader: "ts-loader",
                  options: {
                    transpileOnly: isEnvDevelopment ? true : false,
                  },
                },
              ],
            },
            {
              loader: "file-loader",
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: "all",
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: appHtml }),
      new webpack.DefinePlugin(clientEnv),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          files: "./src/**/*.{ts,tsx,js,jsx}",
        },
      }),
      new ManifestPlugin({
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce(
            (manifest, { name, path }) => ({ ...manifest, [name]: path }),
            seed
          );
          const entryFiles = entrypoints.main.filter(
            (filename) => !/\.map/.test(filename)
          );
          return { files: manifestFiles, entrypoints: entryFiles };
        },
      }),
      isBundleAnalyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    devServer: {
      port: 3000,
      contentBase: appPublic,
      open: true,
      historyApiFallback: true,
      overlay: true,
      stats: "errors-warnings",
    },
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
    cache: {
      type: isEnvDevelopment ? "memory" : isEnvProduction && "filesystem",
    },
    stats: {
      builtAt: false,
      children: false,
      entrypoints: false,
      hash: false,
      modules: false,
      version: false,
      publicPath: true,
      excludeAssets: [/\.(map|txt|html|jpg|png)$/],
      warningsFilter: [/exceed/, /performance/],
    },
  };
};

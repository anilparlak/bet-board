const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const analyze = process.env.ANALYZE === "true";
module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      clean: true,
      publicPath: "",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              envName: isProd ? "production" : "development",
            },
          },
        },
        {
          test: /\.module\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isProd
                    ? "[hash:base64:8]"
                    : "[name]__[local]--[hash:base64:5]",
                  namedExport: false,
                  exportLocalsConvention: "as-is",
                },
                importLoaders: 0,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })]
        : []),
      ...(analyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "server",
              analyzerHost: "127.0.0.1",
              analyzerPort: 8888,
              openAnalyzer: true,
            }),
          ]
        : []),
    ],
    optimization: {
      splitChunks: { chunks: "all" },
    },
    devServer: {
      static: "./dist",
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
    devtool: isProd ? false : "eval-source-map",
  };
};

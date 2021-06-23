const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Visualizer = require("webpack-visualizer-plugin");
const output_file_name = "bundle.[chunkhash].js";

module.exports = {
  mode: "development",
  entry: ["./src/client-entry.tsx"],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
          },
          "css-modules-typescript-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              // mozjpeg: {
              //     progressive: true,
              //     quality: 65
              // },
              // // optipng.enabled: false will disable optipng
              // optipng: {
              //     enabled: false,
              // },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
  },
  output: {
    filename: output_file_name,
    chunkFilename: output_file_name,
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.ProvidePlugin({
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch",
    }),
    new Visualizer({ filename: "../webpack-stats.html" }),
    new webpack.EnvironmentPlugin({
      PAYPAL_CLIENT_ID:
        "AeXq4HrXn-XALAQUrV8fj52OCcieKbKKKX52BwftvylJ-X2I8sX9fGtICqesPdfM8A9rl_nuedKJGsko",
      PAYMENT_ENDPOINT: "https://payment.dev.badanamu.net/",
      AUTH_ENDPOINT: "https://auth.dev.badanamu.net/",
      ACCOUNT_ENDPOINT: "https://account.dev.badanamu.net/",
      PRODUCT_ENDPOINT: "https://product.dev.badanamu.net/",
      REGION_ENDPOINT: "https://beta.region.badanamu.net/",
      ORGANIZATION_SEOUL_ENDPOINT:
        "https://seoul-beta.organization-api.badanamu.net/",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 32 * 1024,
      maxSize: 128 * 1024,
      minChunks: 1,
      name: false,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: "~",
      automaticNameMaxLength: 30,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

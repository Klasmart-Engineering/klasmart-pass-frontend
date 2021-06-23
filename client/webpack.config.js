const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: ["./src/client-entry.tsx"],
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
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
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.ProvidePlugin({
      //'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.EnvironmentPlugin({
      PAYPAL_CLIENT_ID:
        "AeXq4HrXn-XALAQUrV8fj52OCcieKbKKKX52BwftvylJ-X2I8sX9fGtICqesPdfM8A9rl_nuedKJGsko",
      PAYMENT_ENDPOINT: "http://localhost:8092/",
      AUTH_ENDPOINT: "http://localhost:8080/",
      ACCOUNT_ENDPOINT: "http://localhost:8089/",
      PRODUCT_ENDPOINT: "http://localhost:8044/",
      REGION_ENDPOINT: "http://localhost:8094/",
      ORGANIZATION_ENDPOINT: "http://localhost:8084/",
    }),
  ],
};

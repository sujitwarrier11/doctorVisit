const path = require("path");
const webpack = require("webpack");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
  entry: ["./src/app.js", "webpack-hot-middleware/client"],
  output: {
    path: path.join(__dirname, "public/dist"),
    publicPath: "/",
    filename: "bundle.js",
  },
  devtool: "source-map",
  mode: "development",
  target: "web",
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        ENV: "dev",
      },
    }),
  ],
};

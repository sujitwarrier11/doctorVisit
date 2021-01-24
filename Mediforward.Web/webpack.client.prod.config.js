const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: [
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    "./src/app.js",
  ],
  output: {
    path: path.join(__dirname, "public/dist"),
    publicPath: "/dist/",
    filename: "bundle.js",
  },
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
    new webpack.DefinePlugin({
      "process.env": {
        ENV: "prod",
      },
    }),
  ],
};

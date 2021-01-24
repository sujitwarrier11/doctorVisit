const express = require("express");
const app = express();
const port = process.env.PORT || 5006;
const webpack = require("webpack");
const bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
const path = require("path");
const webpackDevMiddleware = require("webpack-dev-middleware");
const configServerDev = require("./webpack.server.dev.config");
const configServerProd = require("./webpack.server.prod.config");
const configClientDev = require("./webpack.client.dev.config");
const configClientProd = require("./webpack.client.prod.config");
const webpackHotMiddleware = require("webpack-hot-middleware");

const isProd = process.env.ENV.trim() === "prod";

const configServer = isProd ? configServerProd : configServerDev;

const configClient = isProd ? configClientProd : configClientDev;

const compiler = webpack([configServer, configClient]);

const env = require("./Env");


if (!isProd) {
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: configServer.output.publicPath,
      serverSideRender: true,
    })
  );

  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(require("./public/dist/server").default(env));
app.listen(port, () => console.log(`Server listening on port ${port}`));

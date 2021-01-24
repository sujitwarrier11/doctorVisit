import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
import Routes from "./Routes";
import createReducer from "@root/src/Redux/reducer";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { StaticRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import theme from "@root/src/theme";
import "regenerator-runtime/runtime";
import "core-js/stable";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, logger];
const store = createStore(createReducer({}), applyMiddleware(...middleware));

const window = {};

const router = express.Router();
function main(env) {
  router.get("*", (req, res, next) => {
    console.log(req.url);
    if (req.url === "/__webpack_hmr" || req.url.indexOf("hot-update.json") > -1)
      return next();
    const sheets = new ServerStyleSheets();
    const app = ReactDOMServer.renderToString(
      sheets.collect(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <StaticRouter location={req.url}>
              <Switch>
                <Routes />
              </Switch>
            </StaticRouter>
          </Provider>
        </ThemeProvider>
      )
    );
    const css = sheets.toString();
    res.send(`<html>
    <head>
    <title></title>
    <meta
    name="viewport"
    content="width=device-width,minimum-scale=1,initial-scale=1"
     />
     <script> const isClient = true; </script>
     <style>${css}</style>
     <link rel="stylesheet" href="/css/app.css">
     <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
     <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script src="/dist/bundle.js" defer></script>
    <style>
    html, body, p, div, h1, h2, h3, h4, h5, h6, ul, ol, dl, img, pre, form, fieldset {
      padding: 0;
      margin: 0;
    }
   @font-face {
      font-family: 'ProximaNova';
      src: url('/fonts/Proxima-Nova-Regular.otf');
   }
    </style>
    </head>
    <body>
    <div style="width:100%;height:100%;" id="root">${app}</div>
    </body>
  </html>`);
  });
  return router;
}

export default main;

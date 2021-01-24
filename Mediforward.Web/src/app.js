import React from "react";
import ReactDom from "react-dom";
import root from "@root/src/Redux/sagas";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import createReducer from "@root/src/Redux/reducer";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "@root/src/theme";
import Routes from "@root/src/Routes";
import "regenerator-runtime/runtime";
import "core-js/stable";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import browserHistory from "@root/src/history";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
console.log("browserHistory", browserHistory);

const sagaMiddleware = createSagaMiddleware();

const initialState = {};

const middleware = [sagaMiddleware, logger, routerMiddleware(browserHistory)];
const store = createStore(
  createReducer(browserHistory),
  {
    provider: {
      patients: [],
    },
    common: {
      chatMessages: {},
    },
  },
  applyMiddleware(...middleware)
);

let persistor = persistStore(store);

const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate;

renderMethod(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConnectedRouter history={browserHistory}>
          {" "}
          <Switch>
            <Routes />
          </Switch>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);

sagaMiddleware.run(root);

console.log("hot", module.hot);
if (module.hot) {
  module.hot.accept("./Routes", () => {
    try {
      const nextRoutes = require("./Routes").default;
      renderMethod(
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ConnectedRouter history={browserHistory}>
                {" "}
                <Switch>
                  <Routes />
                </Switch>
              </ConnectedRouter>
            </PersistGate>
          </Provider>
        </ThemeProvider>,
        document.getElementById("root")
      ); // hot-module updates (ReactDOM.render)
    } catch (err) {
      console.error(`Routes hot reloading error: ${err}`);
    }
  });
}

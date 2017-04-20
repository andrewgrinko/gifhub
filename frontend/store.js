import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import { createLogger } from "redux-logger";
import reducer from "./reducer";

const middlewares = [thunk, routerMiddleware(browserHistory)];

if (process.env.NODE_ENV === "development") {
  middlewares.push(createLogger());
}

function configureStore({ reducer }) {
  const store = createStore(reducer, applyMiddleware(...middlewares));

  if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept("./reducer", () => {
      const nextRootReducer = require("./reducer");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore({ reducer });

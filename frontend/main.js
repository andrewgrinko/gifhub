import "normalize.css";
import "./less/config.less";
import "react-virtualized/styles.css";
import React from "react";
import { Router, browserHistory } from "react-router";
import routes from "./routes";

export default class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        {routes}
      </Router>
    );
  }
}

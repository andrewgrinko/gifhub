import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";

import Main from "./main";

const rootElement = document.getElementById("root");

ReactDOM.render(<Main />, rootElement);

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./main", () => {
    ReactDOM.render(
      <AppContainer>
        <Main />
      </AppContainer>,
      rootElement
    );
  });
}

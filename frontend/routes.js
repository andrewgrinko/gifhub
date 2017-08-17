import React from "react";
import { Route } from "react-router";

import Root from "./modules/root/main";
import NotFound from "./modules/not-found/main";

export default (
  <div>
    <Route component={Root} path="/" />
    <Route path="*" component={NotFound} />
  </div>
);

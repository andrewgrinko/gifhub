import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import RootReducer from "./modules/root";

export default combineReducers({
  root: RootReducer,
  routing: routerReducer
});

import { actions, selectors } from "./";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import isNull from "lodash/isNull";

const Main = props => {
  switch (true) {
    case uninitialized(props):
      return fetchData(props);
    case hasData(props):
      return Render(props);
    case hasError(props):
      return RenderError(props);
    default:
      throw new Error("no state");
  }
};

const uninitialized = props => !hasError(props) && isNull(props.data);
const hasData = props => !hasError(props) && !isNull(props.data);
const hasError = props => !!props.error;

const fetchData = props => {
  props.fetchData();
  return <div>Fetching...</div>;
};

fetchData.propTypes = {
  fetchData: PropTypes.func
};

const RenderError = () => <div>Error!</div>;

const Render = props => {
  return (
    <div className="layout">
      <div className="layout-content">
        <h1>{props.data}</h1>
        <p>Test</p>
        <span>Cool.</span>
        {props.children}
      </div>
    </div>
  );
};

Render.propTypes = {
  children: PropTypes.element,
  data: PropTypes.string
};

export default connect(
  state => ({
    data: selectors.getTestData(state),
    error: selectors.getError(state)
  }),
  dispatch => bindActionCreators(actions, dispatch)
)(Main);

import React from "react";
import PropTypes from "prop-types";
import Header from "../header/main";
import List from "../main/main";

const Root = props => {
  return (
    <div className="layout">
      <div className="layout-content">
        <Header />
        <div className="main-container">
          <List />
        </div>
        {props.children}
      </div>
    </div>
  );
};

Root.propTypes = {
  children: PropTypes.element
};

export default Root;

import "./main.less";
import React from "react";
import PropTypes from "prop-types";

const Gifcommit = props => {
  return (
    <div className="gifcommit">
      <img src={props.url} />
      <div className="commit-message">
        <label>
          Commit message:
        </label>
        <p className="message">{props.message}</p>
      </div>
    </div>
  );
};

Gifcommit.propTypes = {
  url: PropTypes.string,
  message: PropTypes.string
};

export default Gifcommit;

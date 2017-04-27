import "./main.less";
import React from "react";
import PropTypes from "prop-types";

const Gifcommit = props => {
  return (
    <div className="gifcommit">
      <img src={props.url} />
      <p className="message">{props.message}</p>
    </div>
  );
};

Gifcommit.propTypes = {
  url: PropTypes.string,
  message: PropTypes.string
};

export default Gifcommit;

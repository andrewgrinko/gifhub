import "./main.less";
import React from "react";
import PropTypes from "prop-types";

const Gifcommit = props => {
  return (
    <div className="gifcommit">
      <img src={props.data.url} />
      <div className="author">
        <a href={props.data.author.url} target="_blank">
          {props.data.author.name}
        </a>
      </div>
      <div className="commit-message">
        <p className="message">{props.data.message}</p>
      </div>
    </div>
  );
};

Gifcommit.propTypes = {
  data: PropTypes.object
};

export default Gifcommit;

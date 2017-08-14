import "./main.less";
import React from "react";
import PropTypes from "prop-types";

const Gifcommit = props => {
  return (
    <div className="gifcommit" id={`gifcommit_${props.index}`}>
      <img src={props.data.url} onLoad={props.onLoad} />
      <div className="description">
        <div className="author">
          <a href={props.data.author.url} target="_blank">
            {props.data.author.name}
          </a>
        </div>
        <div className="commit-message">
          <p className="message">{props.data.message}</p>
        </div>
      </div>
    </div>
  );
};

Gifcommit.propTypes = {
  data: PropTypes.object,
  index: PropTypes.number,
  onLoad: PropTypes.func
};

export default Gifcommit;

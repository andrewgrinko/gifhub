import "./search.less";
import PropTypes from "prop-types";
import React from "react";

const Search = props => {
  const { labelText, ...inputProps } = props;
  return (
    <div className="search">
      {labelText ? <label htmlFor="search">{labelText}</label> : null}
      <input type="text" name="search" {...inputProps} />
    </div>
  );
};

Search.propTypes = {
  labelText: PropTypes.string
};

export default Search;

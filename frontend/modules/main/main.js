import "./main.less";
import React from "react";
import PropTypes from "prop-types";

import Search from "../shared/search";
import GifcommitsList from "../gifcommits/list/main";

const Main = props => (
  <div className="main-list">
    <SearchBox
      value={props.query}
      onSubmit={props.onSubmit}
      onChange={props.onChange}
    />
    {props.repo
      ? <div className="repo-name">
          <a href={props.repo.url} target="_blank">
            {props.repo.name}
          </a>
        </div>
      : null}
    {props.gifs.length > 0
      ? <GifcommitsList
          hasNextPage={props.hasNextPage}
          list={props.gifs}
          isNextPageLoading={props.isLoading}
          loadNextPage={props.loadNextPage}
        />
      : null}
  </div>
);

Main.propTypes = {
  query: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  loadNextPage: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isLoading: PropTypes.bool,
  repo: PropTypes.object,
  gifs: PropTypes.array
};

export default Main;

const SearchBox = props => {
  return (
    <div className="search-box">
      <form onSubmit={props.onSubmit}>
        <Search
          value={props.value}
          onChange={props.onChange}
          labelText="Paste a URL to a public Github repo or commit"
          placeholder="https://github.com/..."
        />
      </form>
    </div>
  );
};

SearchBox.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string
};

import "./main.less";
import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

import Search from "../shared/search";
import Gifcommit from "../gifcommit/main";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      gifs: [],
      hasNextPage: false,
      link: null
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ query: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const url = this.state.query;
    if (url) {
      fetchGifs(url).then(result => {
        let { gifs, hasNextPage, link } = result.data;
        this.setState({ gifs, hasNextPage, link });
      });
    }
  }

  render() {
    const gifcommits =
      this.state.gifs.length > 0 &&
      this.state.gifs.map((gifObj, i) => {
        return <Gifcommit key={i} data={gifObj} />;
      });

    return (
      <div className="main-list">
        <SearchBox
          value={this.state.query}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
        />
        <div className="gifcommits">
          {gifcommits}
        </div>
      </div>
    );
  }
}

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

const fetchGifs = async function(url) {
  const result = await axios.get("/api/repo", { params: { url } });
  return result;
};

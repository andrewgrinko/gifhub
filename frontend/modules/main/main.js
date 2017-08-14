import "./main.less";
import React from "react";
import axios from "axios";
import PropTypes from "prop-types";

import Search from "../shared/search";
import GifcommitsList from "../gifcommits/list/main";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      gifs: [],
      repo: null,
      hasNextPage: false,
      link: null,
      isLoading: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  onChange(e) {
    this.setState({ query: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const url = this.state.query;
    if (url) {
      fetchGifs(url).then(result => {
        let { repo, gifs, hasNextPage, link } = result.data;
        this.setState({
          repo,
          gifs,
          hasNextPage: !!hasNextPage,
          link,
          isLoading: false
        });
      });
    }
  }

  loadNextPage() {
    const link = this.state.link;
    if (link) {
      this.setState({ isLoading: true });
      fetchNextPage(link).then(result => {
        let { gifs, hasNextPage, link } = result.data;
        this.setState(state => {
          return {
            gifs: state.gifs.concat(gifs),
            hasNextPage: !!hasNextPage,
            link,
            isLoading: false
          };
        });
      });
    }
  }

  render() {
    return (
      <div className="main-list">
        <SearchBox
          value={this.state.query}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
        />
        {this.state.repo
          ? <div className="repo-name">
              <a href={this.state.repo.url} target="_blank">
                {this.state.repo.name}
              </a>
            </div>
          : null}
        {this.state.gifs.length > 0
          ? <GifcommitsList
              hasNextPage={this.state.hasNextPage}
              list={this.state.gifs}
              isNextPageLoading={this.state.isLoading}
              loadNextPage={this.loadNextPage}
            />
          : null}
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

const fetchNextPage = async function(link) {
  const result = await axios.put("/api/repo", { link });
  return result;
};

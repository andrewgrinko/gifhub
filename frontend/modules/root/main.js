import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Header from "../header/main";
import List from "../main/main";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: (this.props.location.query && this.props.location.query.search) ||
        "",
      gifs: [],
      repo: null,
      hasNextPage: false,
      link: null,
      isLoading: false
    };
    this.searchOnSubmit = this.searchOnSubmit.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  searchOnChange(e) {
    this.setState({ query: e.target.value });
  }

  searchOnSubmit(e) {
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
      <div className="layout">
        <div className="layout-content">
          <Header />
          <div className="main-container">
            <List
              onSubmit={this.searchOnSubmit}
              onChange={this.searchOnChange}
              loadNextPage={this.loadNextPage}
              {...this.state}
            />
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Root.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object
};

const fetchGifs = async function(url) {
  const result = await axios.get("/api/repo", { params: { url } });
  return result;
};

const fetchNextPage = async function(link) {
  const result = await axios.put("/api/repo", { link });
  return result;
};

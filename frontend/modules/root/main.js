import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Header from "../header/main";
import List from "../main/main";

const defaultErrorMsg = `Something went horribly wrong and I don't know what it was ʕ•ᴥ•ʔ`;

const initialState = {
  query: "",
  gifs: [],
  repo: null,
  hasNextPage: false,
  link: null,
  isLoading: false,
  error: false,
  errorMessage: defaultErrorMsg
};

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: (this.props.location.query && this.props.location.query.repo) ||
        (this.props.location.query && this.props.location.query.commit),
      ...initialState
    };
    this.searchOnSubmit = this.searchOnSubmit.bind(this);
    this.searchOnChange = this.searchOnChange.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  componentDidMount() {
    if (this.state.query.length) {
      this.searchOnSubmit();
    }
  }

  searchOnChange(e) {
    this.setState({ query: e.target.value });
  }

  searchOnSubmit(e) {
    e && e.preventDefault();
    const url = this.state.query;
    if (url) {
      this.setState({ isLoading: true, error: false });
      fetchGifs(url)
        .then(result => {
          let { repo, gifs, hasNextPage, link } = result.data;
          this.setState({
            repo,
            gifs,
            hasNextPage: !!hasNextPage,
            link,
            isLoading: false,
            error: false,
            errorMessage: defaultErrorMsg
          });
        })
        .catch(e => {
          this.setState({
            isLoading: false,
            error: true,
            errorMessage: e.message
          });
        });
    } else {
      this.setState({ ...initialState });
    }
  }

  loadNextPage() {
    const link = this.state.link;
    if (link) {
      this.setState({ isLoading: true });
      fetchNextPage(link)
        .then(result => {
          let { gifs, hasNextPage, link } = result.data;
          this.setState(state => {
            return {
              gifs: state.gifs.concat(gifs),
              hasNextPage: !!hasNextPage,
              link,
              isLoading: false,
              error: false
            };
          });
        })
        .catch(e => {
          this.setState({
            isLoading: false,
            error: true,
            errorMessage: e.message
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
  let result;
  try {
    result = await axios.get("/api/repo", { params: { url } });
  } catch (e) {
    throw new Error(e.response.data);
  }
  return result;
};

const fetchNextPage = async function(link) {
  let result;
  try {
    result = await axios.put("/api/repo", { link });
  } catch (e) {
    throw new Error(e.response.data);
  }
  return result;
};

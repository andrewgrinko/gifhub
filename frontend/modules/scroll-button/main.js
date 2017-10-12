import "./main.less";
import React from "react";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { className: "button-up" };
    this.listenToScroll = this.listenToScroll.bind(this);
    this.scrollTop = this.scrollTop.bind(this);
  }

  scrollTop(e) {
    e.preventDefault();
    document.body.scrollTop = 0;
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
  }

  listenToScroll() {
    const $list = document.querySelectorAll(".main-list")[0];
    const rect = $list && $list.getBoundingClientRect();
    if (rect && rect.top < 0) {
      this.showButton();
    } else if (rect && rect.top > 0) {
      this.hideButton();
    }
  }

  showButton() {
    this.setState({
      className: "button-up display-button"
    });
  }

  hideButton() {
    this.setState({
      className: "button-up"
    });
  }

  componentDidMount() {
    document.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.listenToScroll);
  }

  render() {
    return (
      <a href="#" onClick={this.scrollTop} className={this.state.className}>
        To top
      </a>
    );
  }
}

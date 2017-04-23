import "./main.less";
import React from "react";
import PropTypes from "prop-types";
import randomColor from "randomcolor";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Gifcommits",
      colors: []
    };
  }

  componentDidMount() {
    this.colorIntervalId = setInterval(() => this.setRandomColorTitle(), 170);
  }

  componentWillUnmount() {
    clearInterval(this.colorIntervalId);
  }

  setRandomColorTitle() {
    if (this.state.colors.length >= this.state.title.length) {
      clearInterval(this.colorIntervalId);
    }
    this.setState({
      colors: this.state.colors.concat(randomColor({ hue: "pink" }))
    });
  }

  render() {
    return (
      <header className="font-dosis-bold">
        <Title colors={this.state.colors} title={this.state.title} />
        <p className="subtitle font-open-sans-semibold">
          Browse GitHub in gifs.
        </p>
      </header>
    );
  }
}

const Title = props => {
  const { title, colors } = props;
  const prettyTitle = title.split("").map((letter, i) => {
    return (
      <span style={colors[i] ? { color: colors[i] } : null} key={i}>
        {letter}
      </span>
    );
  });

  return (
    <h1 className="title">
      {prettyTitle}
    </h1>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  colors: PropTypes.array
};

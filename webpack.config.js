const { resolve } = require("path");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  context: resolve(__dirname, "frontend"),

  entry: (function() {
    let entryPoints = [];
    if (!isProduction) entryPoints.push("react-hot-loader/patch");
    entryPoints.push("./index.js");
    return entryPoints;
  })(),

  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "frontend/dist"),
    publicPath: "/"
  },

  devtool: isProduction ? "source-map" : "inline-eval-cheap-source-map",

  devServer: {
    contentBase: resolve(__dirname, "frontend/dist"),
    hot: true,
    compress: true,
    port: 3001,
    publicPath: "/",
    proxy: {
      "/": "http://localhost:3000"
    }
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  plugins: (function() {
    let plugins = [];

    plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isProduction ? "production" : "development")
        }
      })
    );

    if (!isProduction) {
      plugins.push(new webpack.HotModuleReplacementPlugin());
      plugins.push(new webpack.NamedModulesPlugin());
    } else {
      plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    return plugins;
  })()
};

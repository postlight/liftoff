const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

const trimFieldOrder = require("./src/utils/trimFieldOrder");

dotenv.config();
process.env.FIELD_ORDER = trimFieldOrder(process.env.FIELD_ORDER);
process.env.HOMEPAGE_FIELD_ORDER = trimFieldOrder(
  process.env.HOMEPAGE_FIELD_ORDER
);

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});

module.exports = {
  output: {
    publicPath: "/",
    filename: "bundle.js",
    library: ["env"]
  },
  entry: "./src/index.dev.js",
  mode: "development",
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    htmlPlugin,
    new webpack.EnvironmentPlugin([
      "AIRTABLE_API_KEY",
      "BASE_ID",
      "TABLE_ID",
      "VIEW",
      "FIELD_ORDER",
      "HOMEPAGE_FIELD_ORDER",
      "HEADER_TITLE",
      "SITE_TITLE",
      "PAGE_TITLE_COLUMN",
      "MARKDOWN_FIELDS",
      "SITE_DESCRIPTION"
    ])
  ],
  devServer: {
    port: 8080,
    historyApiFallback: {
      disableDotRule: true
    }
  }
};

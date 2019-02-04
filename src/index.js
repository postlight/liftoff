import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";

import App from "./components/App";
import RowPage from "./RowPage";
import "../custom/main.css";

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" exact component={App} />
      <Route path="/:slugOrId" component={RowPage} />
    </div>
  </Router>,
  document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from "./components/Index";
import RowPage from "./RowPage";
import "../custom/main.css";

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" exact component={Index} />
      <Route path="/:slugOrId" component={RowPage} />
    </div>
  </Router>,
  document.getElementById("root")
);

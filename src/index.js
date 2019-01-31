import React from "react";
import ReactDOM from "react-dom";
import Airtable from "airtable";
import _ from "underscore";

import Row from "./Row";
import "../custom/main.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: [] };
  }

  componentDidMount() {
    // const slug = window.location.pathname.split("/")[1];
    const that = this;
    const rows = [];

    const base = new Airtable({ apiKey: "keytiww9JX4VrEZXr" }).base(
      "app0iDXjSahHmCjKK"
    );

    base("Blog site")
      .select({
        maxRecords: 100,
        view: "Grid view"
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(row => {
            const fieldsArray = _.map(row.fields, (value, name) => ({
              name,
              value
            }));

            const fieldOrderMapped = "Name,Body"
              ? _.object(
                  "Name,Body".split(",").map((field, idx) => [field, idx])
                )
              : null;
            const fields = fieldOrderMapped
              ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
              : fieldsArray;
            rows.push({ ...row, fields });
          });

          // calls page function again while there are still pages left
          fetchNextPage();
        },
        err => {
          if (err) {
            console.error(err);
          }
          that.setState({ rows: _.flatten(rows) });
        }
      );
  }

  render() {
    const { rows } = this.state;
    return (
      <div>
        {rows.map(row => (
          <Row rowData={row} />
        ))}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

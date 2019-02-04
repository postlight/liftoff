import React from "react";
import Airtable from "airtable";
import _ from "underscore";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Row from "./Row";

const LinkOrAnchor = ({ row, slug }) =>
  typeof window === "undefined" ? (
    <a key={row.id} className="row-link" href={`./${slug}.html`}>
      <Row key={row.id} rowData={row} />
    </a>
  ) : (
    <Link key={row.id} className="row-link" to={`./${row.id}`}>
      <Row key={row.id} rowData={row} />
    </Link>
  );

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: [] };
  }

  componentDidMount() {
    const { rows } = this.props;
    if (rows.length) {
      return;
    }

    const that = this;

    // TODO: use env variables
    const base = new Airtable({
      apiKey: "keytiww9JX4VrEZXr"
    }).base("app0iDXjSahHmCjKK");

    // TODO: use env variables
    base("Blog site")
      .select({
        maxRecords: 100,
        // TODO: use env variables
        view: "Grid view"
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(row => {
            const fieldsArray = _.map(row.fields, (value, name) => ({
              name,
              value
            }));

            // TODO: use env variables
            const fieldOrderMapped = "Name,Body"
              ? _.object(
                  "Name,Body".split(",").map((field, idx) => [field, idx])
                )
              : null;
            const fields = fieldOrderMapped
              ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
              : fieldsArray;
            rows.push({
              ...row,
              fields
            });
          });

          // calls page function again while there are still pages left
          fetchNextPage();
        },
        err => {
          if (err) {
            console.error(err);
          }
          that.setState({
            rows: _.flatten(rows)
          });
        }
      );
  }

  render() {
    const { rows: propsRows } = this.props;
    const { rows: stateRows } = this.state;
    const rows = propsRows || stateRows;
    return (
      <div>
        {rows.map(row => {
          const slugField = _.find(row.fields, field => field.name === "_Slug");
          const slug = (slugField && slugField.value) || row.id;
          return <LinkOrAnchor key={row.id} row={row} slug={slug} />;
        })}
      </div>
    );
  }
}

App.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      fields: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      ),
      name: PropTypes.string
    })
  )
};

App.defaultProps = {
  rows: []
};

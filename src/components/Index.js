import React from "react";
import Airtable from "airtable";
import _ from "underscore";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Header from "./Header";
import Row from "./Row";

const LinkOrAnchor = ({ row, slug, fieldsToHide }) =>
  typeof window === "undefined" ? (
    <a key={row.id} className="row-link" href={`/dist/${slug}.html`}>
      <Row fieldsToHide={fieldsToHide} key={row.id} rowData={row} />
    </a>
  ) : (
    <Link key={row.id} className="row-link" to={`/dist/${row.id}.html`}>
      <Row fieldsToHide={fieldsToHide} key={row.id} rowData={row} />
    </Link>
  );

LinkOrAnchor.propTypes = {
  row: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    ),
    name: PropTypes.string
  }),
  slug: PropTypes.string,
  fieldsToHide: PropTypes.arrayOf(PropTypes.string)
};

LinkOrAnchor.defaultProps = {
  row: {},
  slug: "",
  fieldsToHide: null
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: props.rows, metadata: props.metadata };
  }

  componentDidMount() {
    const { rows } = this.props;
    // if there are already rows, don't need to refetch
    if (rows.length) {
      return;
    }

    const that = this;

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.BASE_ID);

    (process.env.METATABLE_NAME
      ? base(process.env.METATABLE_NAME)
          .select()
          .firstPage()
      : Promise.resolve()
    ).then(result => {
      that.setState({ metadata: result && result[0] && result[0].fields });

      base(process.env.TABLE_NAME)
        .select({
          maxRecords: 100,
          view: process.env.VIEW
        })
        .eachPage(
          function page(records, fetchNextPage) {
            records.forEach(row => {
              const fieldsArray = _.map(row.fields, (value, name) => ({
                name,
                value
              }));

              const fieldOrderMapped = process.env.FIELD_ORDER
                ? _.object(
                    process.env.FIELD_ORDER.split(",").map((field, idx) => [
                      field,
                      idx
                    ])
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
    });
  }

  render() {
    const { rows, metadata } = this.state;

    const fieldsToHide = metadata.HomepageHiddenFields
      ? metadata.HomepageHiddenFields.split(", ")
      : [];

    return (
      <div className="index-page">
        {/* this needs to be refactored, shouldn't have check for window here */}
        {typeof window !== "undefined" && metadata && metadata.HeaderTitle && (
          <Header title={metadata.HeaderTitle} />
        )}
        {rows.map(row => {
          const slugField = _.find(row.fields, field => field.name === "_Slug");
          const slug = (slugField && slugField.value) || row.id;
          return (
            <LinkOrAnchor
              fieldsToHide={fieldsToHide}
              key={row.id}
              row={row}
              slug={slug}
            />
          );
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
  ),
  metadata: PropTypes.shape({
    HomepageHiddenFields: PropTypes.string
  })
};

App.defaultProps = {
  rows: [],
  metadata: {}
};

import React from "react";
import Airtable from "airtable";
import _ from "underscore";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Header from "./Header";
import Row from "./Row";

const LinkOrAnchor = ({ to, children }) =>
  typeof window === "undefined" ? (
    <a className="row-link" href={to}>
      {children}
    </a>
  ) : (
    <Link className="row-link" to={to}>
      {children}
    </Link>
  );

LinkOrAnchor.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [...props.rows],
      metadata: Object.assign({}, props.metadata)
    };
  }

  componentDidMount() {
    const { rows } = this.state;
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
    const { pagination } = this.props;

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
          const slug =
            (typeof window === "undefined" && slugField && slugField.value) ||
            row.id;
          const extension = typeof window !== "undefined" ? "" : ".html";
          return (
            <LinkOrAnchor key={row.id} to={`/dist/${slug}${extension}`}>
              <Row fieldsToHide={fieldsToHide} key={row.id} rowData={row} />
            </LinkOrAnchor>
          );
        })}
        {pagination && (
          <div>
            {pagination.back && (
              <LinkOrAnchor to={pagination.back}>
                <span>Back</span>
              </LinkOrAnchor>
            )}
            {pagination.next && (
              <LinkOrAnchor to={pagination.next}>
                <span>Next</span>
              </LinkOrAnchor>
            )}
          </div>
        )}
      </div>
    );
  }
}

Index.propTypes = {
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
  }),
  pagination: PropTypes.shape({
    back: PropTypes.string,
    next: PropTypes.string
  })
};

Index.defaultProps = {
  rows: [],
  metadata: {},
  pagination: null
};

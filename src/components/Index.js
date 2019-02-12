import React from "react";
import _ from "underscore";
import PropTypes from "prop-types";

import LinkOrAnchor from "./LinkOrAnchor";
import Header from "./Header";
import Row from "./Row";

const getFieldsToHide = hiddenFields =>
  hiddenFields ? hiddenFields.split(", ") : [];

const Index = ({ rows, pagination }) => (
  <div className="index-page">
    {/* this needs to be refactored, shouldn't have check for window here */}
    {process.env.HEADER_TITLE && <Header title={process.env.HEADER_TITLE} />}
    {rows.map(row => {
      const slugField = _.find(row.fields, field => field.name === "_Slug");
      const slug =
        (typeof window === "undefined" && slugField && slugField.value) ||
        row.id;
      const extension = typeof window !== "undefined" ? "" : ".html";
      return (
        <LinkOrAnchor key={row.id} to={`/${slug}${extension}`}>
          <Row
            fieldsToHide={getFieldsToHide(process.env.HOMEPAGE_HIDDEN_FIELDS)}
            key={row.id}
            rowData={row}
          />
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
  pagination: PropTypes.shape({
    back: PropTypes.string,
    next: PropTypes.string
  })
};

Index.defaultProps = {
  rows: [],
  pagination: null
};

export default Index;

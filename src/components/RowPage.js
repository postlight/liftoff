import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";
import LinkOrAnchor from "./LinkOrAnchor";
import Header from "./Header";

const RowPage = ({ rowData }) => (
  <div>
    {process.env.HEADER_TITLE && process.env.HEADER_TITLE && (
      <Header title={process.env.HEADER_TITLE} />
    )}
    <Row rowData={rowData} />
    <LinkOrAnchor to="/">Back</LinkOrAnchor>
  </div>
);

RowPage.propTypes = {
  rowData: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    )
  }).isRequired
};
export default RowPage;

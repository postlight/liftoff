import React from "react";
import PropTypes from "prop-types";

import Row from "./Row";
import LinkOrAnchor from "./LinkOrAnchor";
import Header from "./Header";

const RowPage = ({ rowData, metadata }) => (
  <div>
    {metadata && metadata.HeaderTitle && (
      <Header title={metadata.HeaderTitle} />
    )}
    <Row rowData={rowData} />
    <LinkOrAnchor to="/">Back</LinkOrAnchor>
  </div>
);

export default RowPage;

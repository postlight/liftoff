import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import TextField from "./renderers/TextField";

const getRenderer = field => {
  if (typeof field.value === "string" || typeof field.value === "number") {
    return <TextField key={field.name} name={field.name} data={field.value} />;
  }
  return <div />;
};

const Row = ({ rowData }) => (
  <div className="row">
    {_.chain(rowData.fields)
      // fields with names starting with "_" are not meant to be displayed
      .map(field => (!field.name.startsWith("_") ? getRenderer(field) : null))
      .filter(renderer => !!renderer)
      .value()}
  </div>
);

Row.defaultProps = {
  rowData: {}
};

Row.propTypes = {
  rowData: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    )
  })
};

export default Row;

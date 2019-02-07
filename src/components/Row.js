import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import TextField from "./TextField";
import Attachments from "./Attachments";

const getRenderer = field => {
  const { value, name } = field;
  if (typeof value === "string" || typeof value === "number") {
    return <TextField key={name} name={name} data={value} />;
  }

  if (Array.isArray(value)) {
    // is attachment
    if (value.length && value[0].size) {
      return <Attachments key={name} fieldName={name} attachments={value} />;
    }

    return (
      <div>
        {value.map(string => (
          <TextField key={name} name={name} data={string} />
        ))}
      </div>
    );
  }

  return <div />;
};

const Row = ({ rowData, fieldsToHide }) => (
  <div className="row">
    {_.chain(rowData.fields)
      // fields with names starting with "_" are not meant to be displayed
      .map(field =>
        !field.name.startsWith("_") && !fieldsToHide.includes(field.name)
          ? getRenderer(field)
          : null
      )
      .filter(renderer => !!renderer)
      .value()}
  </div>
);

Row.defaultProps = {
  rowData: {},
  fieldsToHide: []
};

Row.propTypes = {
  rowData: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    )
  }),
  fieldsToHide: PropTypes.arrayOf(PropTypes.string)
};

export default Row;

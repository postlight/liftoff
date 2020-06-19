import React from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import TextField from "./TextField";
import Attachments from "./Attachments";
import * as customRenderers from "../../custom/renderers";

const getRenderer = field => {
  const { value, name } = field;
  const customRendererName = name.replace(/\s/g, "");
  if (customRenderers[customRendererName]) {
    const Component = customRenderers[customRendererName];
    return <Component key={name} name={name} value={value} />;
  }

  if (typeof value === "string" || typeof value === "number") {
    return <TextField key={name} fieldName={name} data={value} />;
  }

  if (Array.isArray(value)) {
    // is attachment
    if (value.length && value[0].size) {
      return <Attachments key={name} fieldName={name} attachments={value} />;
    }

    return (
      <div key={name}>
        {value.map((string, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <TextField key={idx} fieldName={name} data={string} />
        ))}
      </div>
    );
  }

  return <div />;
};

const Row = ({ rowData, fieldsToDisplay }) => {
  const mapFields = name => {
    const field = rowData.fields.find(field => field.name === name);
    if (field) return getRenderer(field);

    return field;
  };
  return (
    <div className="row">
      {_.chain(fieldsToDisplay)
        .map(mapFields)
        .filter(renderer => !!renderer)
        .value()}
    </div>
  );
};

Row.defaultProps = {
  rowData: {},
  fieldsToDisplay: []
};

Row.propTypes = {
  rowData: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    )
  }),
  fieldsToDisplay: PropTypes.arrayOf(PropTypes.string)
};

export default Row;

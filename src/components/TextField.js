import React from "react";
import PropTypes from "prop-types";

import stripFieldName from "../utils/stripFieldName";

const TextField = ({ name, data }) => {
  return (
    <div className={`${stripFieldName(name)} field`}>
      <h2 className="field-name">{name}</h2>
      <span className="field-value">{data}</span>
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default TextField;

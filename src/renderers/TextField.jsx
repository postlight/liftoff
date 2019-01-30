import React from "react";
import PropTypes from "prop-types";

const TextField = ({ name, data }) => {
  return (
    <div className={`${name.replace(/\s/g, "")} field`}>
      <h2 className="field-name">{name}</h2>
      <p className="field-value">{data}</p>
    </div>
  );
};

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default TextField;

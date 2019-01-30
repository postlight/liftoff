import React from "react";
import PropTypes from "prop-types";

const Textbox = ({ name, data }) => {
  return (
    <div className={`${name.replace(/\s/g, "")} field`}>
      <p className="field-name">{name}</p>
      <p className="field-value">{data}</p>
    </div>
  );
};

Textbox.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default Textbox;

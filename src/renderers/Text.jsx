import React from "react";
import PropTypes from "prop-types";

const Textbox = field => {
  return <p className={field.name}>{field.data}</p>;
};

Textbox.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired
  }).isRequired
};

export default Textbox;

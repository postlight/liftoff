import React from "react";
import PropTypes from "prop-types";

const Textbox = ({ name, data }) => {
  return <p className={name}>{data}</p>;
};

Textbox.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default Textbox;

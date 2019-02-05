import React from "react";
import PropTypes from "prop-types";

const Header = ({ title, links }) => (
  <div className="header">
    <h1>{title}</h1>
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.shape({}))
};

Header.defaultProps = {
  title: "",
  links: []
};

export default Header;

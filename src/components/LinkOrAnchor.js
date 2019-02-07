import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const LinkOrAnchor = ({ to, children }) =>
  typeof window === "undefined" ? (
    <a className="row-link" href={to}>
      {children}
    </a>
  ) : (
    <Link className="row-link" to={to}>
      {children}
    </Link>
  );

LinkOrAnchor.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default LinkOrAnchor;

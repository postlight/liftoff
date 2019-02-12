import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const LinkOrAnchor = ({ className, to, children }) =>
  typeof window === "undefined" ? (
    <a className={className} href={to}>
      {children}
    </a>
  ) : (
    <Link className={className} to={to}>
      {children}
    </Link>
  );

LinkOrAnchor.propTypes = {
  to: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

LinkOrAnchor.defaultProps = {
  className: "row-link"
};

export default LinkOrAnchor;

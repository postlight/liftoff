import React from "react";
import PropTypes from "prop-types";

const Hero = ({ siteDescription }) => {
  return <h1>{siteDescription}</h1>;
};

Hero.defaultProps = {
  siteDescription: process.env.SITE_DESCRIPTION
};

Hero.propTypes = {
  siteDescription: PropTypes.string
};

export default Hero;

import * as React from "react";

const GoogleMap = ({ value, name }) => {
  return (
    <div
      className={name.replace(" ", "")}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default GoogleMap;

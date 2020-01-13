import * as React from "react";

const RRRSountrack = ({ value, name }) => {
  const className = name.replace(" ", "");
  return (
    <div className={className}>
      <h1>
        <span>RRR</span>
        SOUNDTRACK
      </h1>
      <p>{value}</p>
    </div>
  );
};

export default RRRSountrack;

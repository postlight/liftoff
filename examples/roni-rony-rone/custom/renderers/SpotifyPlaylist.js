import * as React from "react";

const SpotifySoundtrack = ({ value, name }) => {
  return (
    <div className={name.replace(" ", "")}>
      <iframe src={value} frameBorder="0" />
    </div>
  );
};

export default SpotifySoundtrack;

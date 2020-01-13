import * as React from "react";

const SpotifySoundtrack = ({ value, name }) => {
  return (
    <div className={name.replace(" ", "")}>
      <iframe src={value} frameborder="0" />
    </div>
  );
};

export default SpotifySoundtrack;

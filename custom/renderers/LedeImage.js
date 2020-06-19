import * as React from "react";

const LedeImage = ({ value, name }) => {
  const url = value[0].url;
  const style = {
    backgroundImage: `url(${url})`,
    backgroundPosition: "center"
  };

  return <div style={style} className={name} />;
};

export default LedeImage;

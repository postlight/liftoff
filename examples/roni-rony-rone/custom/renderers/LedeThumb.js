import * as React from "react";

const LedeThumb = attachment => {
  const src = attachment.value[0].url;
  return (
    <div className="LedeImage" style={{ backgroundImage: `url(${src})` }} />
  );
};

export default LedeThumb;

import * as React from "react";

const Author = ({ value, name }) => {
  const authors = value.join(", ");
  return (
    <div className="Author">
      <p>An Investigation by {authors}</p>
    </div>
  );
};

export default Author;

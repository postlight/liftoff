import React from "react";
import PropTypes from "prop-types";
import { markdown } from "markdown";

import stripFieldName from "../utils/stripFieldName";

const TextField = ({ fieldName, data }) => {
  const isMarkdown = !!fieldName.match(/\.md$/);
  const name = isMarkdown ? fieldName.replace(/\.md$/, "") : fieldName;

  return (
    <div className={`${stripFieldName(name)} field`}>
      <h2 className="field-name">{name}</h2>
      {isMarkdown ? (
        <span
          className="field-value markdown-field"
          dangerouslySetInnerHTML={{ __html: markdown.toHTML(data) }}
        />
      ) : (
        <span className="field-value">{data}</span>
      )}
    </div>
  );
};

TextField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default TextField;

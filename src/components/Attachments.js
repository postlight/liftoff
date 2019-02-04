import React from "react";
import PropTypes from "prop-types";

import stripFieldName from "../utils/stripFieldName";

const mapAttachmentToComponent = (attachment, fieldName) => {
  if (attachment.type.includes("image")) {
    const src = attachment.url;
    return (
      <img
        key={attachment.id}
        src={src}
        className="attachment-image"
        alt={fieldName}
      />
    );
  }
  return <div />;
};

const Attachments = ({ attachments, fieldName }) => (
  <div className={`attachments field ${stripFieldName(fieldName)}`}>
    <h2 className="field-name">{fieldName}</h2>
    <ul className="field-value">
      {attachments.map(attachment => (
        <li>{mapAttachmentToComponent(attachment)}</li>
      ))}
    </ul>
  </div>
);

export default Attachments;

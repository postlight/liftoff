const trimFieldOrder = fieldOrder =>
  fieldOrder
    ? fieldOrder
        .split(",")
        .map(field => field.trim())
        .join(",")
    : "";

module.exports = trimFieldOrder;

import _ from "underscore";

const formatAirtableRowData = (row, fieldOrder) => {
  const fieldsArray = _.map(row.fields, (value, name) => ({
    name,
    value
  }));
  const fieldOrderMapped = fieldOrder
    ? _.object(fieldOrder.split(",").map((field, idx) => [field, idx]))
    : null;
  const fields = fieldOrderMapped
    ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
    : fieldsArray;
  return { ...row, fields };
};

export default formatAirtableRowData;

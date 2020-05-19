import _ from "underscore";

const formatAirtableRowData = row => {
  const fieldsArray = _.map(row.fields, (value, name) => ({
    name,
    value
  }));
  const fieldOrderMapped = process.env.FIELD_ORDER
    ? _.object(
        process.env.FIELD_ORDER.split(",").map((field, idx) => [field, idx])
      )
    : null;
  const fields = fieldOrderMapped
    ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
    : fieldsArray;
  return { ...row, fields };
};

export default formatAirtableRowData;

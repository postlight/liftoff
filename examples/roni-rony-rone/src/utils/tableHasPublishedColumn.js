const tableHasPublishedColumn = (base, cb) =>
  base(process.env.TABLE_ID)
    .select({
      view: process.env.VIEW,
      maxRecords: 1
    })
    .eachPage(([record]) => cb(!!record.fields.Published));

export default tableHasPublishedColumn;

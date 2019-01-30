require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Airtable = require("airtable");
const _ = require("underscore");

const renderRow = require(`./src/renderRow`).default;

const currentPath = path.basename(__dirname);

const { AIRTABLE_API_KEY, BASE_ID, TABLE_NAME, VIEW } = process.env;

fs.mkdir(`${currentPath}/html`, () => console.log("/html directory created."));

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

// expects an argument such as --field-order Field1,Field2
const fieldOrderIdx =
  process.argv.findIndex(arg => arg === "--field-order") + 1;
const fieldOrder = fieldOrderIdx ? process.argv[fieldOrderIdx] : null;

base(TABLE_NAME)
  .select({
    maxRecords: 100,
    view: VIEW
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(row => {
        const fieldsArray = _.map(row.fields, (value, name) => ({
          name,
          value
        }));

        const fieldOrderMapped = fieldOrder
          ? _.object(fieldOrder.split(",").map((field, idx) => [field, idx]))
          : null;
        const fields = fieldOrder
          ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
          : fieldsArray;

        const slugField = fields.find(field => field.name === "_Slug");
        const slug = (slugField && slugField.value) || row.id;
        const filepath = `dist/html/${slug}.html`;

        fs.writeFile(filepath, renderRow({ ...row, fields }), () => {
          console.log(`${filepath} written`);
        });
      });

      // calls page function again while there are still pages left
      fetchNextPage();
    },
    function done(err) {
      if (err) {
        console.error(err);
      }
    }
  );

fs.copyFile("custom/index.css", "dist/index.css", () =>
  console.log("CSS has been copied")
);

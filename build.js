require("dotenv").config();
const React = require("react");
const fs = require("fs");
const Airtable = require("airtable");
const _ = require("underscore");

const App = require("./src/components/App").default;
const Row = require("./src/components/Row").default;

const renderAsHTMLPage = require(`./src/utils/renderAsHTMLPage`).default;

const {
  AIRTABLE_API_KEY,
  BASE_ID,
  TABLE_NAME,
  VIEW,
  FIELD_ORDER
} = process.env;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

const allRows = [];

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

        const fieldOrderMapped = FIELD_ORDER
          ? _.object(FIELD_ORDER.split(",").map((field, idx) => [field, idx]))
          : null;
        const fields = fieldOrderMapped
          ? _.sortBy(fieldsArray, field => fieldOrderMapped[field.name])
          : fieldsArray;

        const slugField = fields.find(field => field.name === "_Slug");
        const slug = (slugField && slugField.value) || row.id;
        const filepath = `dist/${slug}.html`;

        const formattedRow = { ...row, fields };
        allRows.push(formattedRow);
        fs.writeFile(
          filepath,
          renderAsHTMLPage(<Row rowData={formattedRow} />),
          () => {
            console.log(`${filepath} written`);
          }
        );
      });

      // calls page function again while there are still pages left
      fetchNextPage();
    },
    function done(err) {
      fs.writeFile(
        "dist/index.html",
        renderAsHTMLPage(<App rows={allRows} />),
        () => {
          console.log(`${"dist/index.html"} written`);
        }
      );
      if (err) {
        console.error(err);
      }
    }
  );

fs.copyFile("custom/main.css", "dist/main.css", () =>
  console.log("CSS has been copied")
);

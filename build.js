require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Airtable = require("airtable");

const renderRow = require(`./src/renderRow`).default;

const currentPath = path.basename(__dirname);

const { AIRTABLE_API_KEY, BASE_ID, TABLE_NAME, VIEW } = process.env;

fs.mkdir(`${currentPath}/html`, () => console.log("/html directory created."));

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

base(TABLE_NAME)
  .select({
    maxRecords: 100,
    view: VIEW
  })
  .eachPage(
    function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(row => {
        const slug = row.fields._Slug || row.id;
        const filepath = `dist/html/${slug}.html`;
        fs.writeFile(filepath, renderRow(row), () => {
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

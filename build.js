/* eslint-disable no-console */

import formatAirtableRowData from "./src/utils/formatAirtableRowData";

require("dotenv").config();
const React = require("react");
const fs = require("fs");
const Airtable = require("airtable");
const https = require("https");
const path = require("path");

const Index = require("./src/components/Index").default;
const RowPage = require("./src/components/RowPage").default;

const renderAsHTMLPage = require(`./src/utils/renderAsHTMLPage`).default;

const { AIRTABLE_API_KEY, BASE_ID, TABLE_NAME, VIEW } = process.env;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

const allRows = [[]];

const downloadFile = (url, filepath, onSuccess, onError) => {
  const file = fs.createWriteStream(filepath);
  https
    .get(url, response => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        onSuccess && onSuccess();
      });
    })
    .on("error", fileErr => {
      console.log(fileErr);
      fs.unlink(filepath, error => onError && onError(error));
    });
};

const currentPath = path.basename(__dirname);
fs.mkdir(`${currentPath}/page`, () => {
  console.log("/page directory created.");
});
fs.mkdir(`${currentPath}/assets`, () => {
  console.log("/assets directory created.");
});

// used to make sure multiple pages aren't created for same slug
const alreadySeenSlugs = {};

// if there's a metatable, it needs to be requested prior to the main table
let currentPage = 0;
let recordsOnCurrentPage = 0;
base(TABLE_NAME)
  .select({
    view: VIEW,
    filterByFormula: "{Published}"
  })
  .eachPage(
    function page(records, fetchNextPage) {
      records.forEach(row => {
        if (!allRows[currentPage]) {
          allRows.push([]);
        }
        const formattedRow = formatAirtableRowData(row);

        const attachmentFields = formattedRow.fields.filter(
          field =>
            Array.isArray(field.value) && field.value[0] && field.value[0].size
        );

        attachmentFields.forEach(attachmentField => {
          attachmentField.value.forEach(attachment => {
            const newUrl = `/assets/${attachment.id}-${attachment.filename}`;
            downloadFile(attachment.url, `dist${newUrl}`);
            attachment.url = newUrl;
          });
        });

        const slugField = formattedRow.fields.find(
          field => field.name === "_Slug"
        );
        const slug =
          (slugField &&
            !alreadySeenSlugs[slugField.value] &&
            slugField.value) ||
          formattedRow.id;
        alreadySeenSlugs[slug] = true;

        const filepath = `dist/${slug}.html`;
        allRows[currentPage].push(formattedRow);
        recordsOnCurrentPage += 1;
        if (recordsOnCurrentPage >= 10) {
          recordsOnCurrentPage = 0;
          currentPage += 1;
        }

        // write individual resource page files
        fs.writeFile(
          filepath,
          renderAsHTMLPage(<RowPage rowData={formattedRow} />),
          () => {
            console.log(`${filepath} written`);
          }
        );
      });

      // calls page function again while there are still pages left
      fetchNextPage();
    },
    err => {
      if (err) {
        console.log(err);
      }

      const writeFile = (idx, filepath, pagination) =>
        fs.writeFile(
          filepath,
          renderAsHTMLPage(
            <Index rows={allRows[idx]} pagination={pagination} />
          ),
          () => {
            console.log(`${filepath} written`);
          }
        );

      allRows.forEach((row, idx) => {
        const pageFilepath = `dist/page/${idx + 1}.html`;
        const indexFilepath = `dist/index.html`;
        const pagination = {
          back: idx > 0 ? `/page/${idx}.html` : null,
          next: idx < allRows.length - 1 ? `/page/${idx + 2}.html` : null
        };
        if (idx === 0) {
          // write index page at /
          writeFile(idx, indexFilepath, pagination);
        }
        // write page files for pagination
        writeFile(idx, pageFilepath, pagination);
      });
    }
  );

fs.copyFile("custom/main.css", "dist/main.css", () =>
  console.log("CSS has been copied")
);

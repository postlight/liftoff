/* eslint-disable no-console */

import formatAirtableRowData from "./src/utils/formatAirtableRowData";

require("dotenv").config();

const React = require("react");
const fs = require("fs");
const Airtable = require("airtable");
const https = require("https");

const trimFieldOrder = require("./src/utils/trimFieldOrder");
const Index = require("./src/components/Index").default;
const RowPage = require("./src/components/RowPage").default;
const tableHasPublishedColumn = require("./src/utils/tableHasPublishedColumn")
  .default;

process.env.FIELD_ORDER = trimFieldOrder(process.env.FIELD_ORDER);
process.env.HOMEPAGE_FIELD_ORDER = trimFieldOrder(
  process.env.HOMEPAGE_FIELD_ORDER
);

const renderAsHTMLPage = require(`./src/utils/renderAsHTMLPage`).default;

const { AIRTABLE_API_KEY, BASE_ID, TABLE_ID, VIEW } = process.env;

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

// used to make sure multiple pages aren't created for same slug
const alreadySeenSlugs = {};

const alreadyDownloadedAttachments = {};

let currentPage = 0;
let recordsOnCurrentPage = 0;
tableHasPublishedColumn(base, includePublished =>
  base(TABLE_ID)
    .select({
      view: VIEW,
      ...(includePublished ? { filterByFormula: "{Published}" } : {})
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
              Array.isArray(field.value) &&
              field.value[0] &&
              field.value[0].size
          );

          attachmentFields.forEach(attachmentField => {
            attachmentField.value.forEach(attachment => {
              if (!alreadyDownloadedAttachments[attachment.url]) {
                const newUrl = `/assets/${attachment.id}-${
                  attachment.filename
                }`;
                downloadFile(attachment.url, `dist${newUrl}`);
                alreadyDownloadedAttachments[attachment.url] = true;
                attachment.url = newUrl;
              }
            });
          });

          const slugFieldValue = row.fields.Slug;
          const slug =
            slugFieldValue !== undefined && !alreadySeenSlugs[slugFieldValue]
              ? slugFieldValue
              : formattedRow.id;
          alreadySeenSlugs[slug] = true;

          const pageTitle = row.fields[process.env.PAGE_TITLE_COLUMN];

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
            renderAsHTMLPage(<RowPage rowData={formattedRow} />, pageTitle),
            error => {
              if (error) {
                console.error(`Error writing ${filepath}`);
              } else {
                console.log(`${filepath} written`);
              }
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
            error => {
              if (error) {
                console.error(`Error writing ${filepath}`);
              }
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
    )
);

fs.copyFile("public/default.css", "dist/main.css", () =>
  fs.readFile("custom/styles.css", "utf-8", (err, data) => {
    fs.writeFile("dist/main.css", data, { flag: "a" }, error => {
      if (error) {
        console.error("Error writing custom CSS to dist/main.css");
      } else {
        console.log("custom CSS appended to /dist/main.css");
      }
    });
  })
);

fs.copyFile("custom/favicon.ico", "dist/favicon.ico", err => {
  if (err) {
    console.log("No favicon.ico file found");
  }
});

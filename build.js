import formatAirtableRowData from "./src/utils/formatAirtableRowData";

require("dotenv").config();
const React = require("react");
const fs = require("fs");
const Airtable = require("airtable");
const https = require("https");
const path = require("path");

const Index = require("./src/components/Index").default;
const Row = require("./src/components/Row").default;
const Header = require("./src/components/Header").default;

const renderAsHTMLPage = require(`./src/utils/renderAsHTMLPage`).default;

const {
  AIRTABLE_API_KEY,
  BASE_ID,
  TABLE_NAME,
  VIEW,
  METATABLE_NAME
} = process.env;

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

const allRows = [[]];

const currentPath = path.basename(__dirname);
fs.mkdir(`${currentPath}/page`, () => {
  console.log("/page directory created.");
});

// if there's a metatable, it needs to be requested prior to the main table
(METATABLE_NAME
  ? base(METATABLE_NAME)
      .select()
      .firstPage()
  : Promise.resolve()
).then(result => {
  const metadata = result && result[0] && result[0].fields;
  let currentPage = 0;
  let recordsOnCurrentPage = 0;
  base(TABLE_NAME)
    .select({
      view: VIEW
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(row => {
          if (!allRows[currentPage]) {
            allRows.push([]);
          }
          const formattedRow = formatAirtableRowData(row);

          const slugField = formattedRow.fields.find(
            field => field.name === "_Slug"
          );
          const slug = (slugField && slugField.value) || formattedRow.id;
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
            renderAsHTMLPage(
              <Row metadata={metadata} rowData={formattedRow} />,
              metadata.HeaderTitle && <Header title={metadata.HeaderTitle} />,
              metadata
            ),
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

        const writeFile = (idx, filepath) =>
          fs.writeFile(
            filepath,
            renderAsHTMLPage(
              <Index metadata={metadata} rows={allRows[idx]} />,
              metadata.HeaderTitle && <Header title={metadata.HeaderTitle} />,
              metadata
            ),
            () => {
              console.log(`${filepath} written`);
            }
          );

        allRows.forEach((row, idx) => {
          const pageFilepath = `dist/page/${idx + 1}.html`;
          const indexFilepath = `dist/index.html`;
          if (idx === 0) {
            // write index page at /
            writeFile(idx, indexFilepath);
          }
          // write page files for pagination
          writeFile(idx, pageFilepath);
        });

        // download favicon if available
        if (metadata.Favicon) {
          const file = fs.createWriteStream("dist/favicon.ico");
          https
            .get(metadata.Favicon[0].url, response => {
              response.pipe(file);
              file.on("finish", () => {
                file.close();
                console.log("favicon downloaded + copied to /dist");
              });
            })
            .on("error", fileErr => {
              console.log(fileErr);
              fs.unlink("dist/favicon.ico"); // Delete the file async. (But we don't check the result)
            });
        }
      }
    );
});

fs.copyFile("custom/main.css", "dist/main.css", () =>
  console.log("CSS has been copied")
);

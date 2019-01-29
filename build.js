require("dotenv").config();
const fs = require("fs");
const https = require("https");
const path = require("path");

const renderRow = require(`./src/renderRow`).default;

const currentPath = path.basename(__dirname);

const { AIRTABLE_API_KEY, BASE_ID, TABLE_NAME } = process.env;
const requestUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?api_key=${AIRTABLE_API_KEY}`;

fs.mkdir(`${currentPath}/html`, () => console.log("/html directory created."));

https
  .get(requestUrl, res => {
    const { statusCode } = res;
    const contentType = res.headers["content-type"];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(
        "Invalid content-type.\n" +
          `Expected application/json but received ${contentType}`
      );
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding("utf8");

    let rawData = "";

    res.on("data", chunk => {
      rawData += chunk;
    });

    res.on("end", () => {
      try {
        const parsedData = JSON.parse(rawData);
        parsedData.records.forEach((row, i) => {
          const filename = `dist/html/page${i}.html`;
          console.dir(row);
          fs.writeFile(`dist/html/page${i}.html`, renderRow(row), () => {
            console.log(`${filename} written`);
          });
        });
      } catch (e) {
        console.error(e.message);
      }
    });
  })
  .on("error", e => {
    console.error(`Got error: ${e.message}`);
  });

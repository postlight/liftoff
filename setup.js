const inquirer = require("inquirer");
const fs = require("fs");
const _ = require("underscore");

const formatAnswers = answers =>
  _.map(answers, (answer, key) => {
    const formattedAnswer = !answer.match(/^".*"$/) ? `"${answer}"` : answer;
    return `${key}=${formattedAnswer}`;
  }).join("\n");

inquirer
  .prompt([
    {
      name: "AIRTABLE_API_KEY",
      message: "Please enter your Airtable API key."
    },
    {
      name: "BASE_ID",
      message:
        "Please enter the ID of the base that contains the table you'd like to use."
    },
    {
      name: "TABLE_NAME",
      message: "Please enter the name or ID of the table you'd like to use."
    },
    {
      name: "VIEW",
      message: "Please enter the View you'd like to use."
    },
    {
      name: "HOMEPAGE_FIELD_ORDER",
      message:
        "Please enter the order you'd like a row's fields to appear when displayed on the homepage. Any field not listed here will be hidden."
    },
    {
      name: "FIELD_ORDER",
      message:
        "Please enter the order you'd like a row's fields to appear when displayed on the row's individual page. Any field not listed here will be hidden."
    },
    {
      name: "HEADER_TITLE",
      message:
        "Please enter the title you'd like your website to display in the header on each page. If blank, there will be no header."
    },
    {
      name: "PAGE_TITLE",
      message:
        "Please enter the title of your website. This will be shown in the browser tab."
    }
  ])
  .then(answers => {
    fs.writeFile(`.env`, formatAnswers(answers), () => {
      console.log("Thanks for your answers!");
      console.log("A .env file has been written using your responses.");
    });
  });

const inquirer = require("inquirer");
const fs = require("fs");
const _ = require("underscore");
const UrlPattern = require("url-pattern");

const currentEnv = {};

const getBaseIdFromUrl = url => {
  const pattern = new UrlPattern(
    "(http(s)\\://)(www.)airtable.com/:baseId(/*)"
  );
  return pattern.match(url).baseId;
};

const getTableAndViewIdFromUrl = url => {
  const pattern = new UrlPattern(
    "(http(s)\\://)(www.)airtable.com/:tableId/:viewId(/*)"
  );
  return pattern.match(url);
};

const addQuotes = answer => (!answer.match(/^".*"$/) ? `"${answer}"` : answer);

const formatAnswers = answers =>
  _.map(answers, (answer, key) => {
    if (!answer) {
      if (key === "TABLE_AND_VIEW_IDS") {
        return `TABLE_ID=${addQuotes(currentEnv.TABLE_ID)}\nVIEW=${addQuotes(
          currentEnv.VIEW
        )}`;
      }
      return `${key}=${addQuotes(currentEnv[key])}`;
    }
    if (key === "BASE_ID") {
      return `${key}=${addQuotes(getBaseIdFromUrl(answer))}`;
    }

    if (key === "TABLE_AND_VIEW_IDS") {
      const ids = getTableAndViewIdFromUrl(answer);
      return `TABLE_ID=${addQuotes(ids.tableId)}\nVIEW=${addQuotes(
        ids.viewId
      )}`;
    }

    const formattedAnswer = addQuotes(answer);
    console.log(formattedAnswer);
    return `${key}=${formattedAnswer}`;
  }).join("\n");

const getPrettyVarName = variable =>
  ({
    AIRTABLE_API_KEY: "your Airtable API key",
    BASE_ID: "your Base ID",
    TABLE_ID: "your Table ID",
    VIEW_ID: "your View ID",
    HOMEPAGE_FIELD_ORDER:
      "the order a row's fields will appear in on your homepage",
    FIELD_ORDER:
      "the order a row's fields will appear in on its own individual page",
    HEADER_TITLE: "your header title",
    PAGE_TITLE: "your page title",
    MARKDOWN_FIELDS: "fields that will be displayed in markdown"
  }[variable]);

const getMessage = promptName => {
  const isAlreadyPopulated =
    promptName === "TABLE_AND_VIEW_IDS"
      ? currentEnv.TABLE_ID || currentEnv.VIEW
      : currentEnv[promptName];

  const messages = {
    AIRTABLE_API_KEY:
      "Head to your Airtable account page at https://www.airtable.com/account.\nFrom there, find the 'API' section and click the 'Generate API key' button if you haven't previously generated a key.\nCopy that key and paste it here.\n\nEnter here: ",
    BASE_ID:
      "Go to https://www.airtable.com/api, choose your base from the list, then and copy + paste the URL from your browser's navbar.\nIt should look something like 'https://airtable.com/app0iDXjSahHmCKK/api/docs#curl/introduction'.\n\nEnter here: ",
    TABLE_AND_VIEW_IDS:
      "Navigate to the table and view you would like to use and copy + paste the URL from your browser's navbar.\nIt should look something like 'https://airtable.com/tblUqMBOHEpQeIZ6w/viwmobeZBHQeAIcQK'.\n\nEnter here: ",
    HOMEPAGE_FIELD_ORDER:
      "Enter the order you'd like a row's fields to appear when displayed on the homepage.\nAny field not listed here will be hidden. Example: Body,Description,Image,Author\n\nEnter here: ",
    FIELD_ORDER:
      "Enter the order you'd like a row's fields to appear when displayed on the row's individual page.\nAny field not listed here will be hidden.\nExample: Body,Description,Image,Author\n\nEnter here: ",
    HEADER_TITLE:
      "Enter the title you'd like your website to display in the header on each page.\nIf blank, there will be no header.\n\nEnter here: ",
    PAGE_TITLE:
      "Enter the title of your website. This will be shown in the browser tab.\n\nEnter here: ",
    MARKDOWN_FIELDS:
      "Enter any fields you would like to be rendered in markdown. This is optional.\nExample: Body,Description\n\nEnter here: "
  };

  if (isAlreadyPopulated) {
    if (promptName === "TABLE_AND_VIEW_IDS") {
      return `You previously entered ${currentEnv.TABLE_ID ||
        "nothing"} for your Table ID and ${currentEnv.VIEW ||
        "nothing"} for your View Id.\nIf you'd like to keep those values, simply press enter. Otherwise, please follow the instructions below to enter a new value.\n\n${
        messages[promptName]
      }`;
    }
    return `You previously entered ${
      currentEnv[promptName]
    } for ${getPrettyVarName(
      promptName
    )}.\nIf you'd like to keep that value, simply press enter. Otherwise, please follow the instructions below to enter a new value.\n\n${
      messages[promptName]
    }`;
  }

  return messages[promptName];
};

const runPrompts = () =>
  inquirer
    .prompt([
      {
        name: "AIRTABLE_API_KEY",
        message: `\n\n1. ${getMessage("AIRTABLE_API_KEY")}`
      },
      {
        name: "BASE_ID",
        message: `\n\n2. ${getMessage("BASE_ID")}`
      },
      {
        name: "TABLE_AND_VIEW_IDS",
        message: `\n\n3. ${getMessage("TABLE_AND_VIEW_IDS")}`
      },
      {
        name: "HOMEPAGE_FIELD_ORDER",
        message: `\n\n4. ${getMessage("HOMEPAGE_FIELD_ORDER")}`
      },
      {
        name: "FIELD_ORDER",
        message: `\n\n5. ${getMessage("FIELD_ORDER")}`
      },
      {
        name: "HEADER_TITLE",
        message: `\n\n6. ${getMessage("HEADER_TITLE")}`
      },
      {
        name: "PAGE_TITLE",
        message: `\n\n7. ${getMessage("PAGE_TITLE")}`
      },
      {
        name: "MARKDOWN_FIELDS",
        message: `\n\n8. ${getMessage("MARKDOWN_FIELDS")}`
      }
    ])
    .then(answers => {
      fs.writeFile(`.env`, formatAnswers(answers), () => {
        console.log("Thanks for your answers!");
        console.log("A .env file has been written using your responses.");
        console.log(
          "If you want to change any of your responses, you can either run `yarn setup` again or change them directly in the .env file."
        );
        console.log(
          "Now you can run `yarn run start:dev` in your terminal window to get started developing."
        );
      });
    });

fs.readFile(".env", "utf-8", (err, data) => {
  if (err) {
    return;
  }

  const env = data.split("\n");
  env.forEach(entry => {
    const [variable, value] = entry.split("=");
    if (variable) {
      currentEnv[variable] = value
        ? value.replace(/^"/gi, "").replace(/"$/gi, "")
        : "";
    }
  });

  runPrompts();
});

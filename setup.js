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
    "(http(s)\\://)(www.)airtable.com/:tableId/:viewId(/*)(?*)"
  );
  return pattern.match(url);
};

const addQuotes = answer =>
  answer && !answer.match(/^".*"$/) ? `"${answer}"` : answer || '""';

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
    PAGE_TITLE_COLUMN:
      "the column whose values will populate each row's page title",
    SITE_TITLE: "your site title",
    MARKDOWN_FIELDS: "fields that will be displayed in markdown"
  }[variable]);

const getMessage = promptName => {
  const isAlreadyPopulated =
    promptName === "TABLE_AND_VIEW_IDS"
      ? currentEnv.TABLE_ID || currentEnv.VIEW
      : currentEnv[promptName];

  const messages = {
    AIRTABLE_API_KEY:
      "Head to your Airtable account page at https://www.airtable.com/account.\nOn that page, find the 'API' section and click the 'Generate API key' button\nif you haven't previously generated a key.\n\nCopy and paste your API key here: ",
    BASE_ID:
      "Go to https://www.airtable.com/api, click on the base you want to use as\nyour CMS, then and copy + paste the URL from your browser's navbar.\n\nIt should look something like:\n\n    https://airtable.com/app0iDXjSahHmCKK/api/docs#curl/introduction\n\nEnter here: ",
    TABLE_AND_VIEW_IDS:
      "Navigate to the table and view you would like to use and copy + paste the\nURL from your browser's navbar.\n\nIt should look something like:\n\n    https://airtable.com/tblUqMBOHEpQeIZ6w/viwmobeZBHQeAIcQK\n\nEnter here: ",
    // TODO: What happens if the column has a space in it? Do I need to surround it in quotes? Just type it as is? Should include this in the example.
    HOMEPAGE_FIELD_ORDER:
      "The front page of your site will show a list of each of your entries — sort\nof like the homepage of a blog. Enter the order you'd like your row's fields to\nappear when displayed on the homepage.\n\nAny field not listed here will be hidden. \n\n    Example: Body,Description,Image,Author\n\nEnter here: ",
    FIELD_ORDER:
      "Enter the order you'd like a row's fields to appear when displayed on\nthe row's individual page. Any field not listed here will be hidden.\n\n    Example: Body,Description,Image,Author\n\nEnter here: ",
    HEADER_TITLE:
      "Enter the title you'd like your website to display in the header on each\npage. If blank, there will be no header.\n\nEnter here: ",
    PAGE_TITLE_COLUMN:
      "Enter the column in your table that corresponds to the name or title of each row.\nThis will be shown in the browser tab in the format 'Site Title – Page Title'.\nIf left blank, there will be no row-specific page titles set.\n\nEnter here: ",
    SITE_TITLE:
      "Enter the title of your website. This will be shown in the browser tab.\n\nEnter here: ",
    MARKDOWN_FIELDS:
      "Enter any fields you would like to be rendered in markdown. This is optional.\nIf you don't use markdown, or don't know what it is, just press 'Enter'.\n\n    Example: Body,Description\n\nEnter here: "
  };

  if (isAlreadyPopulated) {
    if (promptName === "TABLE_AND_VIEW_IDS") {
      return `You previously entered ${currentEnv.TABLE_ID ||
        "nothing"} for your Table ID and ${currentEnv.VIEW ||
        "nothing"} for your View Id. If you'd like to keep those values, simply press enter. Otherwise, please follow the instructions below to enter a new value.\n\n${
        messages[promptName]
      }`;
    }
    return `You previously entered ${
      currentEnv[promptName]
    } for ${getPrettyVarName(
      promptName
    )}. If you'd like to keep that value, simply press enter. Otherwise, please follow the instructions below to enter a new value.\n\n${
      messages[promptName]
    }`;
  }

  return messages[promptName];
};

const runPrompts = () => {
  // TODO console.log some intro text?
  console.log("\n");
  inquirer
    .prompt([
      {
        name: "AIRTABLE_API_KEY",
        message: `1. ${getMessage("AIRTABLE_API_KEY")}`
      },
      {
        name: "BASE_ID",
        message: `2. ${getMessage("BASE_ID")}`
      },
      {
        name: "TABLE_AND_VIEW_IDS",
        message: `3. ${getMessage("TABLE_AND_VIEW_IDS")}`
      },
      {
        name: "HOMEPAGE_FIELD_ORDER",
        message: `4. ${getMessage("HOMEPAGE_FIELD_ORDER")}`
      },
      {
        name: "FIELD_ORDER",
        message: `5. ${getMessage("FIELD_ORDER")}`
      },
      {
        name: "HEADER_TITLE",
        message: `6. ${getMessage("HEADER_TITLE")}`
      },
      {
        name: "PAGE_TITLE_COLUMN",
        message: `7. ${getMessage("PAGE_TITLE_COLUMN")}`
      },
      {
        name: "SITE_TITLE",
        message: `8. ${getMessage("SITE_TITLE")}`
      },
      {
        name: "MARKDOWN_FIELDS",
        message: `9. ${getMessage("MARKDOWN_FIELDS")}`
      }
    ])
    .then(answers => {
      fs.writeFileSync(`.env`, formatAnswers(answers));

      console.log("\n\n-------------");
      console.log("\n\nThanks for your answers!\n");
      console.log(
        "Your responses have been written to a file in this directory called .env.\n"
      );
      console.log(
        "If you want to change any of your responses, you can either run `yarn setup` again\nor edit them directly in the .env file.\n"
      );
      console.log(
        "To get started developing, open your terminal window and run:\n\n    yarn start:dev\n\nYou're probably going to want to start styling your web site. Here's how:\n\n    https://github.com/postlight/liftoff/#styling\n"
      );
      console.log(
        "When you're ready to build your site, simply run:\n\n    yarn build\n"
      );
      console.log("Happy developing!\n");
    });
};

const dotenv = ".env";
if (!fs.existsSync(dotenv)) fs.writeFileSync(".env", "");

const data = fs.readFileSync(dotenv, "utf-8");

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

import { renderToStaticMarkup } from "react-dom/server";

const renderAsHTMLPage = component => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${(process.env.PAGE_TITLE && process.env.PAGE_TITLE) ||
      (process.env.HEADER_TITLE && process.env.HEADER_TITLE) ||
      "Homepage"}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
    <link rel="shortcut icon" href="/favicon.ico" />
  </head>
  <body>
    ${renderToStaticMarkup(component)}
  </body>
</html>`;

export default renderAsHTMLPage;

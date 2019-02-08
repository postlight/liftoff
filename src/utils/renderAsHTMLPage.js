import { renderToStaticMarkup } from "react-dom/server";

const renderAsHTMLPage = (component, metadata) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${(metadata && metadata.PageTitle) ||
      (metadata && metadata.HeaderTitle) ||
      "Homepage"}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
    ${metadata.Favicon && '<link rel="shortcut icon" href="/favicon.ico" />'}
  </head>
  <body>
    ${renderToStaticMarkup(component)}
  </body>
</html>`;

export default renderAsHTMLPage;

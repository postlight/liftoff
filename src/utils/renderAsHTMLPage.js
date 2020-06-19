import { renderToStaticMarkup } from "react-dom/server";

const renderAsHTMLPage = (component, pageTitle) => {
  const siteTitle =
    process.env.SITE_TITLE || process.env.HEADER_TITLE || "Homepage";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${pageTitle ? `${pageTitle} – ` : ""}${siteTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="/main.css" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Bitter&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:900&display=swap" rel="stylesheet">
  </head>
  <body>
    ${renderToStaticMarkup(component)}
  </body>
</html>`;
};

export default renderAsHTMLPage;

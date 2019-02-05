import { renderToStaticMarkup } from "react-dom/server";

const renderAsHTMLPage = (component, header) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Page Title</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" media="screen" href="./main.css" />
</head>
<body>
  ${header && renderToStaticMarkup(header)}
  ${renderToStaticMarkup(component)}
</body>
</html>
`;

export default renderAsHTMLPage;

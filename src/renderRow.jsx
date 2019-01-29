import React from "react";
import _ from "underscore";
import { renderToStaticMarkup } from "react-dom/server";

import Text from "./renderers/Text";

const getRenderer = row => {
  if (typeof row.data === "string" || typeof row.data === "number") {
    return <Text name={row.name} data={row.data} />;
  }
  return <div />;
};

const renderRow = rowData => {
  const row = (
    <div className="row">
      {_.map(rowData.fields, (data, key) => getRenderer({ name: key, data }))}
    </div>
  );

  return `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
    </head>
    <body>${renderToStaticMarkup(row)}</body>
  </html>`;
};

export default renderRow;

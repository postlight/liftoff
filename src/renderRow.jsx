import React from "react";
import _ from "underscore";
import { renderToStaticMarkup } from "react-dom/server";

import Text from "./renderers/Text";

const getRenderer = field => {
  if (typeof field.value === "string" || typeof field.value === "number") {
    return <Text key={field.name} name={field.name} data={field.value} />;
  }
  return <div />;
};

const renderRow = rowData => {
  const row = (
    <div className="row">
      {_.chain(rowData.fields)
        // fields with names starting with "_" are not meant to be displayed
        .map(field => (!field.name.startsWith("_") ? getRenderer(field) : null))
        .filter(renderer => !!renderer)
        .value()}
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

import React from "react";
import Airtable from "airtable";
import PropTypes from "prop-types";

import Row from "./components/Row";
import Header from "./components/Header";
import formatAirtableRowData from "./utils/formatAirtableRowData";

export default class RowPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { row: null };
  }

  componentDidMount() {
    const {
      match: {
        params: { slugOrId }
      }
    } = this.props;
    // TODO: use env variables
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.BASE_ID);

    const that = this;
    // TODO: use env variables
    base(process.env.TABLE_NAME).find(slugOrId, (err, record) => {
      that.setState({
        row: formatAirtableRowData(record)
      });
    });

    base(process.env.METATABLE_NAME)
      .select()
      .firstPage((err, record) => {
        that.setState({
          metadata: record && record[0] && record[0].fields
        });
      });
  }

  render() {
    const { row, metadata } = this.state;
    return row ? (
      <div>
        {metadata && metadata.HeaderTitle && (
          <Header title={metadata.HeaderTitle} />
        )}
        <Row rowData={row} />
      </div>
    ) : (
      <div />
    );
  }
}

RowPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slugOrId: PropTypes.string
    })
  }).isRequired
};

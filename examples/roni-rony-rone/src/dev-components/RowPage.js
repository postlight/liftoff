import React from "react";
import Airtable from "airtable";
import PropTypes from "prop-types";

import Row from "../components/RowPage";
import formatAirtableRowData from "../utils/formatAirtableRowData";

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

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.BASE_ID);

    const that = this;

    base(process.env.TABLE_ID).find(slugOrId, (err, record) => {
      that.setState({
        row: formatAirtableRowData(record)
      });
    });
  }

  render() {
    const { row } = this.state;
    return row ? <Row rowData={row} /> : <div />;
  }
}

RowPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slugOrId: PropTypes.string
    })
  }).isRequired
};

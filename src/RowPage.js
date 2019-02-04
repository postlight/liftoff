import React from "react";
import Airtable from "airtable";

import Row from "./components/Row";
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
      apiKey: "keytiww9JX4VrEZXr"
    }).base("app0iDXjSahHmCjKK");

    const that = this;
    // TODO: use env variables
    base("Blog site").find(slugOrId, (err, record) => {
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

import React from 'react';
import { Table } from 'semantic-ui-react';

const TableRow = ({ name, value }) => (
  <Table.Row>
    <Table.Cell>{name}</Table.Cell>
    <Table.Cell>{value}</Table.Cell>
  </Table.Row>
);

export default TableRow;

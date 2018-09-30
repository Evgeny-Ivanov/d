import React, { Component } from 'react';
import { Button, Icon, Loader, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import TableRow from './TableRow';
import './style.css';

@inject('gasEngineStore')
@observer
class Result extends Component {
  render() {
    const { vars, isLoading } = this.props.gasEngineStore;

    if (!vars.M_пч) {
      return null;
    }

    if (isLoading) {
      return (
        <Loader active />
      );
    }

    return (
      <Table celled collapsing className='flex-item'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Параметр</Table.HeaderCell>
            <Table.HeaderCell>Значение</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <TableRow name={<span>M<sub>пч</sub></span>} value={vars.M_пч} />
          <TableRow name={<span>[E]</span>} value={vars.E_потребная} />
          <TableRow name={<span>[V<sub>пч</sub>]</span>} value={vars.V_пч_потребная} />
          <TableRow name={<span>ν<sub>зр_з</sub></span>} value={vars.ν_зр_з} />
          <TableRow name={<span>η<sub>зс_с</sub></span>} value={vars.η_зс_с} />
          <TableRow name={<span>M<sub>пр1</sub></span>} value={vars.M_пр1} />
          <TableRow name={<span>M<sub>пр2</sub></span>} value={vars.M_пр2} />
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan='2'>
              <Button floated='right' icon labelPosition='left' color='green' size='small' className='excel-button' onClick={() => alert('TODO')}>
                <Icon name='file excel outline' /> Сохранить в Excel
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>

      </Table>
    );
  }
}

export default Result;

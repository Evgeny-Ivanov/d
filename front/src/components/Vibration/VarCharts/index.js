import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Progress, Segment, Tab } from 'semantic-ui-react';
import Chart from '../../Chart';
import './style.css';

@inject('vibrationStore')
@observer
class Charts extends Component {
  render() {
    const { varCharts, isLoadingVar, percent } = this.props.vibrationStore;

    if (isLoadingVar) {
      return (
        <Progress percent={percent} indicating progress>
            Идет расчет. Это займет много времени.
        </Progress>
      );
    }

    if (!varCharts.x) {
      return null;
    }

    const panes = [
      {
        menuItem: 'o(t)',
        render: () => (
          <Chart title='o(t)' x={varCharts.x.slice()} y={varCharts.o.slice()} />
        ),
      },
      {
        menuItem: 'y(t)',
        render: () => (
          <Chart title='y(t)' x={varCharts.x.slice()} y={varCharts.y.slice()} />
        ),
      },
    ];

    return (
      <div>
        <Header as='h5' attached='top' textAlign='center'>
          Результаты:
        </Header>

        <Segment className='result-segment' loading={isLoadingVar} attached>
          <Tab
            menu={{
              fluid: true, vertical: true, tabular: 'left', className: 'result-menu',
            }}
            panes={panes}
          />
        </Segment>
      </div>
    );
  }
}

export default Charts;

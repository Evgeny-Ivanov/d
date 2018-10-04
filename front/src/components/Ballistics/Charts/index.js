import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Segment, Tab } from 'semantic-ui-react';
import Chart from '../../Chart';
import { convertJuliaChartArrInJsArr } from '../../../helpers';
import './style.css';

@inject('ballisticsStore')
@observer
class Charts extends Component {
  render() {
    const { forM50, for15, for50, isLoading } = this.props.ballisticsStore;

    if (!forM50 || !forM50.u || !forM50.t) return null;

    const tM50 = forM50.t.filter(item => item !== undefined);
    const pM50 = convertJuliaChartArrInJsArr(forM50.u, 0);
    const vM50 = convertJuliaChartArrInJsArr(forM50.u, 4);
    const lM50 = convertJuliaChartArrInJsArr(forM50.u, 5);

    const t15 = for15.t.filter(item => item !== undefined);
    const p15 = convertJuliaChartArrInJsArr(for15.u, 0);
    const v15 = convertJuliaChartArrInJsArr(for15.u, 4);
    const l15 = convertJuliaChartArrInJsArr(for15.u, 5);

    const t50 = for50.t.filter(item => item !== undefined);
    const p50 = convertJuliaChartArrInJsArr(for50.u, 0);
    const v50 = convertJuliaChartArrInJsArr(for50.u, 4);
    const l50 = convertJuliaChartArrInJsArr(for50.u, 5);

    const panes = [
      {
        menuItem: 'p(t)',
        render: () => (
          <Chart title='p(t)' xArr={[tM50, t15, t50]} yArr={[pM50, p15, p50]} />
        ),
      },
      {
        menuItem: 'v(t)',
        render: () => (
          <Chart title='v(t)' xArr={[tM50, t15, t50]} yArr={[vM50, v15, v50]}  />
        ),
      },
      {
        menuItem: 'l(t)',
        render: () => (
          <Chart title='l(t)' xArr={[tM50, t15, t50]} yArr={[lM50, l15, l50]}  />
        ),
      },
    ];

    return (
      <div>
        <Header as='h5' attached='top' textAlign='center'>
          Результаты интегрирования:
        </Header>

        <Segment className='result-segment' loading={isLoading} attached>
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

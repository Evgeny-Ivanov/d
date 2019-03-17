import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Header, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart';
import {convertJuliaChartArrInJsArr} from '../../../helpers';
import './style.css';


@inject('ballisticsStore', 'gasEngineStore')
@observer
class Charts extends Component {
    findIndex = (arr, l) => {
        for (let i = 0; i < arr.length; i++) {
           if(arr[i] >= l) return i;
        }
        return arr.length - 1;
    };

    render() {
        const {forM50, for15, for50, isLoading} = this.props.ballisticsStore;
        const {l_д} = this.props.gasEngineStore.input;

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

        const indexM50 = this.findIndex(lM50, l_д);
        const index15 = this.findIndex(l15, l_д);
        const index50 = this.findIndex(l50, l_д);

        const panes = [
            {
                menuItem: 'p(t)',
                render: () => (
                    <Chart title='p(t)' xArr={[tM50, t15, t50]} yArr={[pM50, p15, p50]}/>
                ),
            },
            {
                menuItem: 'v(t)',
                render: () => (
                    <Chart title='v(t)'
                           xArr={[tM50.slice(0, indexM50), t15.slice(0, index15), t50.slice(0, index50)]}
                           yArr={[vM50.slice(0, indexM50), v15.slice(0, index15), v50.slice(0, index50)]}
                    />
                ),
            },
            {
                menuItem: 'l(t)',
                render: () => (
                    <Chart title='l(t)'
                           yArr={[lM50.slice(0, indexM50), l15.slice(0, index15), l50.slice(0, index50)]}
                           xArr={[tM50.slice(0, indexM50), t15.slice(0, index15), t50.slice(0, index50)]}
                    />
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

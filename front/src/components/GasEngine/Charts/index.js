import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {Header, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart';
import {convertJuliaChartArrInJsArr} from '../../../helpers';
import './style.css';

@inject('gasEngineStore')
@observer
class Charts extends Component {
    static propTypes = {
        gasEngineStore: PropTypes.shape({
            isLoading: PropTypes.bool,
            vars: PropTypes.object.isRequired,
            charts: PropTypes.object.isRequired,
        }).isRequired,
    };

    findIndex = (arr, l) => {
        for (let i = 0; i < arr.length; i++) {
           if(arr[i] >= l) return i;
        }
        return arr.length - 1;
    };


    render() {
        const {charts, isLoading} = this.props.gasEngineStore;
        const {l_д} = this.props.gasEngineStore.input;

        if (!charts.t) {
            return null;
        }

        const t = charts.t.filter(item => item !== undefined);
        const p = convertJuliaChartArrInJsArr(charts.u, 0);
        const v = convertJuliaChartArrInJsArr(charts.u, 4);
        const l = convertJuliaChartArrInJsArr(charts.u, 5);
        const v_п = convertJuliaChartArrInJsArr(charts.u, 8);
        const x_п = convertJuliaChartArrInJsArr(charts.u, 9);
        const p_п = convertJuliaChartArrInJsArr(charts.u, 10);


        const indexLд = this.findIndex(l, l_д);


        const panes = [
            {
                menuItem: 'p(t)',
                render: () => (
                    <Chart title='p(t)' x={t} y={p}/>
                ),
            },
            {
                menuItem: 'v(t)',
                render: () => (
                    <Chart title='v(t)' x={t.slice(0, indexLд)} y={v.slice(0, indexLд)}/>
                ),
            },
            {
                menuItem: 'l(t)',
                render: () => (
                    <Chart title='l(t)' x={t.slice(0, indexLд)} y={l.slice(0, indexLд)}/>
                ),
            },
            {
                menuItem: 'p_п(t)',
                render: () => (
                    <Chart title='p_п(t)' x={t} y={p_п}/>
                ),
            },
            {
                menuItem: 'v_п(t)',
                render: () => (
                    <Chart title='v_п(t)' x={t} y={v_п}/>
                ),
            },
            {
                menuItem: 'x_п(t)',
                render: () => (
                    <Chart title='x_п(t)' x={t} y={x_п}/>
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

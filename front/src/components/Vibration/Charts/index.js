import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Header, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart';
import './style.css';

@inject('vibrationStore')
@observer
class Charts extends Component {
    render() {
        const {charts, isLoading, input} = this.props.vibrationStore;

        if (!charts.t) {
            return null;
        }

        const panes = [
            {
                menuItem: 'o(t)',
                render: () => (
                    <Chart title='o(t)' x={charts.t.slice()} y={charts.o.slice()}/>
                ),
            },
            {
                menuItem: 'y(t)',
                render: () => (
                    <Chart title='y(t)' x={charts.t.slice()} y={charts.y.slice()}/>
                ),
            },
            {
                menuItem: 'y(x)',
                render: () => (
                    <Chart title='стационарный прогиб y(x)' x={charts.x_stationary.slice()}
                           y={charts.y_stationary.slice()}/>
                ),
            },
        ];

        return (
            <div>
                <Header as='h5' attached='top' textAlign='center'>
                    Результаты:
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

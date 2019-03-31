import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Header, Loader, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart/index';
import './style.css';

@inject('vibrationStore')
@observer
class Charts extends Component {
    render() {
        const {varCharts, isLoadingVar, percent} = this.props.vibrationStore;

        if (isLoadingVar) {
            return (
                  <Segment style={{'height': '400px'}}>
                    <Loader active size='massive'>Идет расчет. Это займет много времени.</Loader>
                  </Segment>
            );
        }

        if (!varCharts.x) {
            return null;
        }

        const panes = [
            {
                menuItem: 'o(t)',
                render: () => (
                    <Chart title='o(x)' x={varCharts.x.slice()} y={varCharts.o.slice()}/>
                ),
            },
            {
                menuItem: 'y(t)',
                render: () => (
                    <Chart title='y(x)' x={varCharts.x.slice()} y={varCharts.y.slice()}/>
                ),
            },
        ];

        return (
            <div>
                <Header as='h5' attached='top' textAlign='center'>
                    Результаты:
                </Header>

                <Segment className='result-segment-l' loading={isLoadingVar} attached>
                    <Tab
                        menu={{
                            fluid: true, vertical: true, tabular: 'left', className: 'result-menu-l',
                        }}
                        panes={panes}
                    />
                </Segment>
            </div>
        );
    }
}

export default Charts;

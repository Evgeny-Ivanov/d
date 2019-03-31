import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Header, Loader, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart/index';
import './style.css';

@inject('vibrationStore')
@observer
class Charts extends Component {
    render() {
        const {varChartsD, isLoadingVarD} = this.props.vibrationStore;

        if (isLoadingVarD) {
            return (
                  <Segment style={{'height': '400px'}}>
                    <Loader active size='massive'>Идет расчет. Это займет много времени.</Loader>
                  </Segment>
            );
        }

        if (!varChartsD.x) {
            return null;
        }

        const panes = [
            {
                menuItem: 'o(d)',
                render: () => (
                    <Chart title='o(d)' x={varChartsD.x.slice()} y={varChartsD.o.slice()}/>
                ),
            },
            {
                menuItem: 'y(d)',
                render: () => (
                    <Chart title='y(d)' x={varChartsD.x.slice()} y={varChartsD.y.slice()}/>
                ),
            },
        ];

        return (
            <div>
                <Header as='h5' attached='top' textAlign='center'>
                    Результаты (перебор идет от меньшего диаметра к большему):
                </Header>

                <Segment className='result-segment-d' loading={isLoadingVarD} attached>
                    <Tab
                        menu={{
                            fluid: true, vertical: true, tabular: 'left', className: 'result-menu-d',
                        }}
                        panes={panes}
                    />
                </Segment>
            </div>
        );
    }
}

export default Charts;

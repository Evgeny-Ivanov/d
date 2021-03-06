import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Header, Loader, Segment, Tab} from 'semantic-ui-react';
import Chart from '../../Chart/index';
import './style.css';

@inject('vibrationStore')
@observer
class Charts extends Component {
    render() {
        const {varChartsL, isLoadingVarL} = this.props.vibrationStore;

        if (isLoadingVarL) {
            return (
                  <Segment style={{'height': '400px'}}>
                    <Loader active size='massive'>Идет расчет. Это займет много времени.</Loader>
                  </Segment>
            );
        }

        if (!varChartsL.x) {
            return null;
        }

        const panes = [
            {
                menuItem: 'o(x)',
                render: () => (
                    <Chart title='o(x)' x={varChartsL.x.slice()} y={varChartsL.o.slice()}/>
                ),
            },
            {
                menuItem: 'y(x)',
                render: () => (
                    <Chart title='y(x)' x={varChartsL.x.slice()} y={varChartsL.y.slice()}/>
                ),
            },
        ];

        return (
            <div>
                <Header as='h5' attached='top' textAlign='center'>
                    Результаты:
                </Header>

                <Segment className='result-segment-l' loading={isLoadingVarL} attached>
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

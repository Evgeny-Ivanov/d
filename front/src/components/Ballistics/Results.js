import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import Charts from './Charts';
import Chart from "../Chart";
import {Input, Label, List, Button} from 'semantic-ui-react'


@inject('ballisticsStore')
@observer
class Results extends Component {
    state = {
        points: [
            {label: 'Свд', value: 0.62},
            {label: 'Свд-c', value: 0.1} // TODO
        ],
        label: '',
        value: '0.1'
    };

    addPoint = () => {
        this.setState({
            points: [...this.state.points, {value: Number(this.state.value), label: this.state.label}],
            label: '',
            value: '0.1'
        })
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    removePoint = (index) => {

    };

    render() {
        const {rationaleLRes} = this.props.ballisticsStore;
        return (
            <div>
                <Charts/>
                {rationaleLRes && rationaleLRes.l && rationaleLRes.v && (
                    <div style={{marginTop: 10}}>
                        <div>
                            <Chart x={rationaleLRes.l.slice()} y={rationaleLRes.v.slice()}
                                   vertialLines={this.state.points}/>
                            <div style={{marginTop: 10}}>
                                <Input labelPosition='right' type='text'>
                                    <Label basic>Название точки</Label>
                                    <input name="label" value={this.state.label} onChange={this.handleChange}
                                    />
                                </Input>
                            </div>
                            <div style={{marginTop: 10}}>
                                <Input labelPosition='right' type='text'>
                                    <Label basic>Координата</Label>
                                    <input name="value" value={this.state.value} onChange={this.handleChange}
                                    />
                                    <Label>м</Label>
                                </Input>
                            </div>
                            <Button onClick={() => this.addPoint()}>Add</Button>
                        </div>
                        <List>
                            {
                                this.state.points.map((item) => (
                                    <List.Item>
                                        <List.Content>
                                            <List.Header>{item.label}</List.Header>
                                            {item.value}
                                        </List.Content>
                                        <List.Content floated='right'>
                                            <Button>Add</Button>
                                        </List.Content>
                                    </List.Item>
                                ))
                            }
                        </List>
                    </div>
                )}
            </div>
        );
    }
}

export default Results;

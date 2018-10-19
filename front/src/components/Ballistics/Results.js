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
            {label: 'Свд-С', value: 0.565} // TODO
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
        let ps = [...this.state.points];
        ps.splice(index, 1);
        this.setState({
            points: ps
        });
    };


    removePoint = (index) => {
        let ps = [...this.state.points];
        ps.splice(index, 1);
        this.setState({
            points: ps
        });
    };

    togglePoint = (index) => {
        let ps = [...this.state.points];
        ps[index].hide = !ps[index].hide;
        this.setState({
            points: ps
        });
    };

    render() {
        const {rationaleLRes} = this.props.ballisticsStore;
        return (
            <div>
                <Charts/>
                {rationaleLRes && rationaleLRes.l && rationaleLRes.v && (
                    <div style={{marginTop: 10}}>
                        <div style={{display: 'flex'}}>
                            <Chart x={rationaleLRes.l.slice()} y={rationaleLRes.v.slice()}
                                   vertialLines={this.state.points}/>
                            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 10}}>
                                <div style={{display: 'flex'}}>
                                    <div>
                                        <Input labelPosition='right' type='text'>
                                            <Label basic>Координата</Label>
                                            <input style={{width: 60}} name="value" value={this.state.value}
                                                   onChange={this.handleChange}/>
                                            <Label>м</Label>
                                        </Input>
                                    </div>
                                    <div>
                                        <Input labelPosition='right' type='text' style={{marginLeft: 10}}>
                                            <Label basic>Название точки</Label>
                                            <input name="label" value={this.state.label} onChange={this.handleChange}/>
                                        </Input>
                                    </div>
                                    <div>
                                        <Button onClick={() => this.addPoint()} style={{marginLeft: 10}}>Добавить</Button>
                                    </div>
                                </div>
                                <div>
                                <List style={{marginTop: 20}}>
                                    {
                                        this.state.points.map((item, index) => (
                                            <List.Item style={{display: 'flex', justifyContent: 'space-between',}} className="points-list-item">
                                                <List.Content>
                                                    <List.Header>{item.label}</List.Header>
                                                    {item.value}
                                                </List.Content>
                                                <List.Content>
                                                    <Button onClick={() => this.togglePoint(index)}>{item.hide ? 'Показать' : 'Скрыть'}</Button>
                                                    <Button onClick={() => this.removePoint(index)}>Удалить</Button>
                                                </List.Content>
                                            </List.Item>
                                        ))
                                    }
                                </List>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Results;

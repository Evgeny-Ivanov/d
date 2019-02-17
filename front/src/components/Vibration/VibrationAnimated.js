import React, {Component} from 'react';
import {Button, Segment} from 'semantic-ui-react';
import Plot from 'react-plotly.js';
import {inject, observer} from 'mobx-react';


@inject('vibrationStore')
@observer
class VibrationAnimated extends Component {
    state = {
        x: [],
        y: [],
        title: 'none',
        speed: 10,
    };

    runAnimated = (index = 0) => {
        let {charts} = this.props.vibrationStore;
        if (!charts || !charts.y_anim) return;

        this.stopAnimated();

        this.timer = setInterval(() => {
            let {charts, input} = this.props.vibrationStore;
            let yForT = charts.y_anim[index];
            this.setState({
                x: charts.x_stationary.slice(),
                y: yForT.slice(),
                title: `t = ${charts.t[index]} c.`
            });

            index += this.state.speed;
            this.index = index;
            if (index >= charts.y_anim.length) this.stopAnimated();
        }, 100);

    };

    stopAnimated = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
    };

    incSpeed = () => {
        this.setState({
            speed: this.state.speed + 10
        })
    };

    decSpeed = () => {
        if (this.state.speed - 10 > 0) {
            this.setState({
                speed: this.state.speed - 10
            })
        }
    };

    resumeAnimated = () => {
        if (this.index) {
            this.runAnimated(this.index);
        }
    };

    componentWillUnmount = () => this.stopAnimated();

    render() {
        return (
            <Segment className='result-segment' attached>
                <Plot
                    data={[
                        {
                            ...this.state,
                            type: 'scatter',
                            mode: 'lines+points',
                            marker: {color: 'red'},
                            line: {shape: 'spline'},
                        }
                    ]}
                    layout={{
                        width: 1200,
                        title: this.state.title,
                        xaxis: {
                            //title: this.props.xTitle,
                            exponentformat: 'power',
                        },
                        yaxis: {
                            //title: this.props.yTitle,
                            exponentformat: 'power',
                        },
                    }}
                />

                <div style={{marginTop: 10}}>
                    <Button onClick={() => this.runAnimated()}>Старт</Button>
                    <Button onClick={() => this.stopAnimated()}>Стоп</Button>
                    <Button onClick={() => this.resumeAnimated()}>Продолжить</Button>
                </div>

                <div style={{marginTop: 10}}>
                    <Button onClick={() => this.incSpeed()}>Увеличить скорость</Button>
                    <Button onClick={() => this.decSpeed()}>Уменьшить скорость</Button>
                    <span style={{marginLeft: 10}}>Скорость: x{this.state.speed / 10}</span>
                </div>
            </Segment>
        );
    }
}

export default VibrationAnimated;

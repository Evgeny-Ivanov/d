import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import Plot from 'react-plotly.js';
import { inject, observer } from 'mobx-react';


@inject('vibrationStore')
@observer
class VibrationAnimated extends Component {
    state = {
        x: [],
        y: [],
        title: 'none'
    };

    runAnimated = () => {
        let { charts } = this.props.vibrationStore;
        if (!charts || !charts.y_anim) return;

        this.stopAnimated();

        let index = 0;
        let indexStep = 10;

        this.timer = setInterval(() => {
            let { charts, input } = this.props.vibrationStore;
            let yForT = charts.y_anim[index];
            this.setState({
                x: charts.x_stationary.slice(0, input.n_dx),
                y: yForT.slice(0, input.n_dx),
                title: `t = ${charts.t[index]} c.`
            });

            index += indexStep;
            if (index >= charts.y_anim.length) this.stopAnimated();
        }, 100);

    };

    stopAnimated = () => {
        if(this.timer) {
            clearInterval(this.timer);
        }
    };

    componentWillUnmount = () => this.stopAnimated();

    render() {
        return (
            <div>
                <Plot
                    data={[
                      {
                          ...this.state,
                        type: 'scatter',
                        mode: 'lines+points',
                        marker: { color: 'red' },
                        line: { shape: 'spline' },
                      }
                    ]}
                    layout={{
                      height: 700,
                      width: 1300,
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

                <Button onClick={() => this.runAnimated()} >Старт</Button>
                <Button onClick={() => this.stopAnimated()} >Стоп</Button>
            </div>
        );
    }
}

export default VibrationAnimated;

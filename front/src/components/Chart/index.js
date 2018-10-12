import React, {Component} from 'react';
import Plot from 'react-plotly.js';

class Chart extends Component {
    render() {
        let {x, y, xArr, yArr, vertialLines} = this.props;

        let data = [{
            type: 'scatter',
            mode: 'lines+points',
            x: x,
            y: y,
            marker: {color: 'red'},
            line: {shape: 'spline'},
        }];

        if (xArr && yArr) {
            data = [];
            for (let i = 0; i < xArr.length; i++) {
                data.push({
                    type: 'scatter',
                    mode: 'lines+points',
                    x: xArr[i],
                    y: yArr[i],
                    marker: {color: 'red'},
                    line: {shape: 'spline'},
                });
            }
        }

        let shapes = [];
        if (vertialLines) {
            for (let i = 0; i < vertialLines.length; i++) {
                shapes.push({
                    type: 'line',
                    x0: vertialLines[i].value,
                    y0: 400,
                    x1: vertialLines[i].value,
                    y1: 1000,
                    line: {
                        color: 'grey',
                        dash: 'dot'
                    }
                });

            }
        }

        return (
            <Plot
                data={data}
                layout={{
                    height: 400,
                    width: 700,
                    title: this.props.title,
                    shapes: shapes,
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
        );
    }
}

export default Chart;

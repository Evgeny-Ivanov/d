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
                    line: {shape: 'spline'},
                });
            }
        }

        let shapes = [];
        let annotations = [];
        if (vertialLines) {
            for (let i = 0; i < vertialLines.length; i++) {
                if (!vertialLines[i].hide) {
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

                    annotations.push({
                        x: vertialLines[i].value,
                        y: (1000 + 400) / 2, // FIXME
                        text: vertialLines[i].label
                    })
                }
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
                    annotations: annotations,
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

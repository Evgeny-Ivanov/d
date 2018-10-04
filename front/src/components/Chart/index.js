import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class Chart extends Component {
  render() {
    let {x, y, xArr, yArr} = this.props;

    let data = [{
        type: 'scatter',
        mode: 'lines+points',
        x: x,
        y: y,
        marker: { color: 'red' },
        line: { shape: 'spline' },
    }];

    if (xArr && yArr) {
        data = [];
        for(let i = 0; i< xArr.length; i++) {
            data.push({
                type: 'scatter',
                mode: 'lines+points',
                x: xArr[i],
                y: yArr[i],
                marker: { color: 'red' },
                line: { shape: 'spline' },
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

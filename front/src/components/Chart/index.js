import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';

class Result extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    x: PropTypes.array.isRequired,
    y: PropTypes.array.isRequired,
  };

  render() {
    return (
      <Plot
        data={[ // массив - можно разместить на одном холсте несколько графиков
          {
            type: 'scatter',
            mode: 'lines+points',
            x: this.props.x,
            y: this.props.y,
            marker: { color: 'red' },
            line: { shape: 'spline' },
          }]}

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

export default Result;

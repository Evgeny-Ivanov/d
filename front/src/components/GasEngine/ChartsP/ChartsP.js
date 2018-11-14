import React, {Component} from 'react';
import Chart from '../../Chart';
import {inject, observer} from "mobx-react/index";


let pk10 = [0, 0, 0, 3.5522e+007, 6.746e+007, 8.5107e+007, 9.1249e+007, 8.9575e+007, 8.2682e+007, 7.3326e+007, 6.3786e+007, 5.5504e+007, 4.8751e+007, 4.2925e+007];
let pk70 = [0, 0, 0, 0, 0, 7.911e+006, 4.1002e+007, 5.7372e+007, 6.372e+007, 6.1315e+007, 5.7137e+007, 5.3535e+007, 4.8688e+007, 4.3462e+007];
let pk140 = [0, 0, 0, 0, 0, 0, 0, 2.3615e+007, 3.9852e+007, 4.1795e+007, 4.17e+007, 4.3741e+007, 4.3266e+007, 4.0792e+007];
let pk210 = [0, 0, 0, 0, 0, 0, 0, 0, 1.878e+007, 2.3958e+007, 2.6902e+007, 3.2572e+007, 3.5335e+007, 3.4601e+007];
let pk280 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0658e+006, 7.6405e+006, 1.8302e+007, 2.471e+007, 2.6226e+007];
let pk350 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.6522e+006, 1.447e+007, 2.1773e+007, 2.3538e+007];
let pk430 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.2439e+006, 1.2301e+007, 1.5707e+007];
let pk510 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.928e+006, 7.0647e+006];
let pk570 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3.3971e+005];
let tp = [0, 0.0001, 0.0002, 0.0003, 0.0004, 0.0005, 0.0006, 0.0007, 0.0008, 0.0009, 0.001, 0.0011, 0.0012, 0.0013];


@inject('gasEngineStore')
@observer
class Charts extends Component {
    render() {
        const {isLoading, varCharts} = this.props.gasEngineStore;

        if (!varCharts) {
            return <div/>;
        }

        let n = 0.25;

        return (
            <div>
                <Chart title='pk10(t)' xArr={[tp, varCharts.t[0].slice(0, Math.floor(varCharts.t[0].length * n) ) ]} yArr={[pk10, varCharts.p[0].slice(0, Math.floor(varCharts.t[0].length * n) ) ]} />
                <Chart title='pk70(t)' xArr={[tp, varCharts.t[1].slice(0, Math.floor(varCharts.t[1].length * n) ) ]} yArr={[pk70, varCharts.p[1].slice(0, Math.floor(varCharts.t[1].length * n) ) ]} />
                <Chart title='pk140(t)' xArr={[tp, varCharts.t[2].slice(0, Math.floor(varCharts.t[2].length * n) ) ]} yArr={[pk140, varCharts.p[2].slice(0, Math.floor(varCharts.t[2].length * n) ) ]} />
                <Chart title='pk210(t)' xArr={[tp, varCharts.t[3].slice(0, Math.floor(varCharts.t[3].length * n) ) ]} yArr={[pk210, varCharts.p[3].slice(0, Math.floor(varCharts.t[3].length * n) ) ]} />
                <Chart title='pk280(t)' xArr={[tp, varCharts.t[4].slice(0, Math.floor(varCharts.t[4].length * n) ) ]} yArr={[pk280, varCharts.p[4].slice(0, Math.floor(varCharts.t[4].length * n) ) ]} />
                <Chart title='pk350(t)' xArr={[tp, varCharts.t[5].slice(0, Math.floor(varCharts.t[5].length * n) ) ]} yArr={[pk350, varCharts.p[5].slice(0, Math.floor(varCharts.t[5].length * n) ) ]} />
                <Chart title='pk430(t)' xArr={[tp, varCharts.t[6].slice(0, Math.floor(varCharts.t[6].length * n) ) ]} yArr={[pk430, varCharts.p[6].slice(0, Math.floor(varCharts.t[6].length * n) ) ]} />
                <Chart title='pk510(t)' xArr={[tp, varCharts.t[7].slice(0, Math.floor(varCharts.t[7].length * n) ) ]} yArr={[pk510, varCharts.p[7].slice(0, Math.floor(varCharts.t[7].length * n) ) ]} />
                <Chart title='pk570(t)' xArr={[tp, varCharts.t[8].slice(0, Math.floor(varCharts.t[8].length * n) ) ]} yArr={[pk570, varCharts.p[8].slice(0, Math.floor(varCharts.t[8].length * n) ) ]} />
            </div>
        );
    }
}

export default Charts;

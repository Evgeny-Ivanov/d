import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Icon} from 'semantic-ui-react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import Charts from './Charts';
import VarCharts from './VarCharts';
import VarChartsL from './VarChartsL';
import VarChartsD from './VarChartsD';
import VibrationForm from './Forms/VibrationForm';
import GeometryForm from '../GasEngine/Forms/GeometryForm';
import TimeForm from '../GasEngine/Forms/TimeForm';
import PowderForm from '../GasEngine/Forms/PowderForm';
import ZForm from '../GasEngine/Forms/ZForm';
import RForm from '../GasEngine/Forms/RForm';
import μform from '../GasEngine/Forms/μForm';
import OtherVarForm from '../GasEngine/Forms/OtherVarForm';
import VibrationAnimated from './VibrationAnimated';
import './style.css';

@inject('vibrationStore', 'gasEngineStore')
@observer
class Vibration extends Component {
    state = {
        activeResult: false,
    };

    handleToggleActive = () => {
        this.setState({activeResult: !this.state.activeResult});
    };

    handleCalculationVar = async () => {
        this.setState({activeResult: true});
        await this.props.vibrationStore.calculationVar();
    };

    handleCalculationVarL = async () => {
        this.setState({activeResult: true});
        await this.props.vibrationStore.calculationVarL();
    };

    handleCalculationVarD = async () => {
        this.setState({activeResult: true});
        await this.props.vibrationStore.calculationVarD();
    };

    handleCalculation = async () => {
        await this.props.vibrationStore.calculation();
        this.setState({activeResult: true});
    };

    render() {
        const {isLoading, isLoadingVar, isLoadingVarL, isLoadingVarD, charts, varCharts, varChartsL, varChartsD} = this.props.vibrationStore;

        return (
            <div>
                <div style={{marginBottom: '20px'}}>
                    <ReactCSSTransitionReplace
                        transitionName={!this.state.activeResult ? 'carousel-swap2' : 'carousel-swap1'}
                        transitionEnterTimeout={1000}
                        transitionLeaveTimeout={1000}
                    >
                        {!this.state.activeResult
                            ? (
                                <div key='1'>
                                    <div className='flex-container'>
                                        <div>
                                            <PowderForm/>
                                        </div>

                                        <div>
                                            <GeometryForm/>
                                            <OtherVarForm/>
                                        </div>

                                        <div>
                                            <TimeForm/>
                                            <RForm/>
                                        </div>

                                        <div>
                                            <μform/>
                                            <ZForm/>
                                        </div>

                                        <div>
                                            <VibrationForm/>
                                        </div>
                                    </div>

                                    <div className='default_margin-top'>
                                        <Button onClick={this.handleCalculation} loading={isLoading}>
                                            Расчет для текущего положения камеры
                                        </Button>
                                        <Button onClick={this.handleCalculationVar} loading={isLoadingVar}>
                                            Расчет для разных положений камеры
                                        </Button>
                                        <Button onClick={this.handleCalculationVarL} loading={isLoadingVarL}>
                                            Расчет для разных длин ствола
                                        </Button>
                                        <Button onClick={this.handleCalculationVarD} loading={isLoadingVarD}>
                                            Расчет для разных диаметров
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div key='2'>
                                    <div className='default_margin-top'>
                                        <Charts/>
                                    </div>
                                    <div className='default_margin-top'>
                                        <VarCharts/>
                                    </div>
                                    <div className='default_margin-top'>
                                        <VarChartsL/>
                                    </div>
                                    <div className='default_margin-top'>
                                        <VarChartsD/>
                                    </div>
                                    {charts && charts.y_anim && (
                                        <div className='default_margin-top'>
                                            <VibrationAnimated/>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </ReactCSSTransitionReplace>
                </div>

                {(charts.t || varCharts.x || varChartsL.x || varChartsD.x) && (
                    !this.state.activeResult
                        ? (
                            <Button icon labelPosition='right' onClick={this.handleToggleActive}>
                                Перейти к результатам
                                <Icon name='right arrow'/>
                            </Button>
                        ) : (
                            <Button icon labelPosition='left' onClick={this.handleToggleActive}>
                                Вернуться
                                <Icon name='left arrow'/>
                            </Button>
                        )
                )}
            </div>
        );
    }
}

export default Vibration;

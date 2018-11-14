import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Icon, Tab} from 'semantic-ui-react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import GeometryForm from './Forms/GeometryForm';
import TimeForm from './Forms/TimeForm';
import PowderForm from './Forms/PowderForm';
import ZForm from './Forms/ZForm';
import RForm from './Forms/RForm';
import μform from './Forms/μForm';
import OtherVarForm from './Forms/OtherVarForm';
import Vars from './Vars';
import Charts from './Charts';
import ChartsP from './ChartsP/ChartsP';
import './style.css';


@inject('gasEngineStore')
@observer
class Bgd extends Component {
    state = {
        activeResult: false,
    };

    handleToggleActive = () => {
        this.setState({activeResult: !this.state.activeResult});
    };

    handleCalculation = async () => {
        await this.props.gasEngineStore.calculation();
        this.setState({activeResult: true});
    };

    handleCalculationVar = async () => {
        await this.props.gasEngineStore.calculationVar();
        this.setState({activeResult: true});
    };

    render() {
        const {isLoading, vars} = this.props.gasEngineStore;

        return (
            <div>
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
                                </div>

                                <Button
                                    className='default_margin-top'
                                    loading={isLoading}
                                    onClick={this.handleCalculation}
                                    disabled={isLoading}
                                >
                                    Расчет
                                </Button>

                                <Button
                                    className='default_margin-top'
                                    loading={isLoading}
                                    onClick={this.handleCalculationVar}
                                    disabled={isLoading}
                                >
                                    Расчет раз пол
                                </Button>
                            </div>
                        ) : (
                            <div className='flex-container' key='2'>
                                <Tab
                                    menu={{secondary: true, pointing: true}}
                                    panes={[
                                        {menuItem: 'Графики', render: () => <Charts/>}, {
                                            menuItem: 'Переменные',
                                            render: () => <Vars/>
                                        },
                                    ]}
                                />
                                <ChartsP />
                            </div>
                        )
                    }
                </ReactCSSTransitionReplace>

                <div className='default_margin-top'>
                    {vars.M_пч && (
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
            </div>
        );
    }
}

export default Bgd;

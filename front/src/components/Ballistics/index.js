import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Tab } from 'semantic-ui-react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import PowderForm from '../GasEngine/Forms/PowderForm';
import ZForm from '../GasEngine/Forms/ZForm';
import OtherVarForm from '../GasEngine/Forms/OtherVarForm';
import Charts from './Charts';
import '../GasEngine/style.css';
import Chart from "../Chart";


@inject('ballisticsStore')
@observer
class Bgd extends Component {
  state = {
    activeResult: false,
  };

  handleToggleActive = () => {
    this.setState({ activeResult: !this.state.activeResult });
  };

  handleCalculation = async () => {
    await this.props.ballisticsStore.calculation();
    this.setState({ activeResult: true });
  };

  handleCalculationRationaleL = async () => {
    await this.props.ballisticsStore.calculationRationaleL();
    this.setState({ activeResult: true });
  };

  render() {
    const { isLoading, rationaleLRes } = this.props.ballisticsStore;
    console.log("rationaleLRes", rationaleLRes);
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
                    <PowderForm />
                  </div>

                  <div>
                    <OtherVarForm />
                  </div>

                  <div>
                    <ZForm />
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
                  onClick={this.handleCalculationRationaleL}
                  disabled={isLoading}
                >
                Обоснование длины
                </Button>
              </div>
            ) : (
              <div className='flex-container' key='2'>
                  <Charts />
                  {rationaleLRes && rationaleLRes.l && rationaleLRes.v && (
                      <Chart x={rationaleLRes.l.slice()} y={rationaleLRes.v.slice()} />
                  )}
              </div>
            )
          }
        </ReactCSSTransitionReplace>

        <div className='default_margin-top'>
          {(
            !this.state.activeResult
              ? (
                <Button icon labelPosition='right' onClick={this.handleToggleActive}>
                  Перейти к результатам
                  <Icon name='right arrow' />
                </Button>
              ) : (
                <Button icon labelPosition='left' onClick={this.handleToggleActive}>
                  Вернуться
                  <Icon name='left arrow' />
                </Button>
              )
          )}
        </div>
      </div>
    );
  }
}

export default Bgd;

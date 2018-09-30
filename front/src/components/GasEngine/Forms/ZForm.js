import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Message } from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class ZForm extends Component {
  handleChange = (e) => {
    this.props.gasEngineStore.input[e.target.name] = e.target.value;
  };

  render() {
    const { input } = this.props.gasEngineStore;
    return (
      <div className='flex-item'>
        <Message
          attached
          header='Параметры заряжания:'
        />
        <Form className='attached fluid segment'>
          <Input
            label='Калибр'
            dimension='мм'
            name='d'
            value={input.d}
            onChange={this.handleChange}
          />

          <Input
            label='площадь канала ствола'
            dimension='мм^2'
            name='S'
            value={input.S}
            onChange={this.handleChange}
          />


          <Input
            label='масса снаряда'
            dimension='г'
            name='ω'
            value={input.ω}
            onChange={this.handleChange}
          />


          <Input
            label='масса заряда'
            dimension='г'
            name='q'
            value={input.q}
            onChange={this.handleChange}
          />


          <Input
            label='объем каморы'
            dimension='см^3'
            name='W_км'
            value={input.W_км}
            onChange={this.handleChange}
          />

          <Input
            label='Крешерное давление'
            dimension='МПа'
            name='p_max_кр'
            value={input.p_max_кр}
            onChange={this.handleChange}
          />

          <Input
            label='Коэффициент крешера'
            dimension=''
            name='N_кр'
            value={input.N_кр}
            onChange={this.handleChange}
          />
        </Form>
      </div>
    );
  }
}

export default ZForm;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Message } from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class PowderForm extends Component {
  handleChange = (e) => {
    this.props.gasEngineStore.input[e.target.name] = e.target.value;
  };

  render() {
    const { input } = this.props.gasEngineStore;
    return (
      <div className='flex-item'>
        <Message
          attached
          header='Характеристики порохового заряда:'
        />
        <Form className='attached fluid segment'>
          <Input
            label='Сила пороха'
            dimension='МДж/кг'
            name='f_'
            value={input.f_}
            onChange={this.handleChange}
          />

          <Input
            label='Коволюм пороховых газов'
            dimension='дм^3/кг'
            name='α_k'
            value={input.α_k}
            onChange={this.handleChange}
          />

          <Input
            label='Показатель адиабаты'
            dimension=''
            name='k'
            value={input.k}
            onChange={this.handleChange}
          />

          <Input
            label='Коэффициент формы пороховых зерен z.k'
            dimension=''
            name='z_k'
            value={input.z_k}
            onChange={this.handleChange}
          />

          <Input
            label='Коэффициент формы пороховых зерен k.1'
            dimension=''
            name='κ'
            value={input.κ}
            onChange={this.handleChange}
          />

          <Input
            label='Коэффициент формы пороховых зерен λ.1'
            dimension=''
            name='λ'
            value={input.λ}
            onChange={this.handleChange}
          />

          <Input
            label='Плотность пороха'
            dimension='кг/дм^3'
            name='δ'
            value={input.δ}
            onChange={this.handleChange}
          />

          <Input
            label='Импульс пороха'
            dimension='МПа/с'
            name='I_k'
            value={input.I_k}
            onChange={this.handleChange}
          />

          <Input
            label='Какая то температура T_1'
            dimension='К'
            name='T_1'
            value={input.T_1}
            onChange={this.handleChange}
          />

          <Input
            label='K_f'
            dimension=''
            name='K_f'
            value={input.K_f}
            onChange={this.handleChange}
          />


          <Input
            label='K_I'
            dimension=''
            name='K_I'
            value={input.K_I}
            onChange={this.handleChange}
          />
        </Form>
      </div>
    );
  }
}

export default PowderForm;

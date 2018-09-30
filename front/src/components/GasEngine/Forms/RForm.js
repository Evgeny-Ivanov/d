import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Message } from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class TimeForm extends Component {
  handleChange = (e) => {
    this.props.gasEngineStore.input[e.target.name] = e.target.value;
  };

  render() {
    const { input } = this.props.gasEngineStore;
    return (
      <div className='flex-item'>
        <Message
          attached
          header='Назначение расчетных параметров:'
        />
        <Form className='attached fluid segment'>
          <Input
            label='величина соотношения массы затвора и затворной рамы'
            dimension=''
            name='n'
            value={input.n}
            onChange={this.handleChange}
          />

          <Input
            label='коэффициент трения'
            dimension=''
            name='f_тр'
            value={input.f_тр}
            onChange={this.handleChange}
          />


          <Input
            label='угол поворота выступов затвора при отпирании канала ствола'
            dimension='град'
            name='α'
            value={input.α}
            onChange={this.handleChange}
          />

          <Input
            label='радиус выступа затвора'
            dimension='мм'
            name='r'
            value={input.r}
            onChange={this.handleChange}
          />
        </Form>
      </div>
    );
  }
}

export default TimeForm;

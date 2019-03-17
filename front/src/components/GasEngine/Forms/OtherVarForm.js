import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Message} from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class OtherVarForm extends Component {
    handleChange = (e) => {
        this.props.gasEngineStore.input[e.target.name] = e.target.value;
    };

    render() {
        const {input} = this.props.gasEngineStore;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Другие параметры:'
                />
                <Form className='attached fluid segment'>
                    <Input
                        label='Импульс выстрела'
                        dimension='Н*с'
                        name='I_в'
                        value={input.I_в}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Температура'
                        dimension='К'
                        name='T'
                        value={input.T}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Коэффициент учета второстепенных работ'
                        dimension=''
                        name='K'
                        value={input.K}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Постоянная коэффициента теплоотдачи'
                        dimension=''
                        name='σ_T'
                        value={input.σ_T}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Относительная разность температур газа и стенки'
                        dimension=''
                        name='ν_T'
                        value={input.ν_T}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Давление вспышки'
                        dimension='МПа'
                        name='p_всп'
                        value={input.p_всп}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Давление форсирования'
                        dimension='МПа'
                        name='p_0'
                        value={input.p_0}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Длина ствола'
                        dimension='м'
                        name='l_д'
                        value={input.l_д}
                        onChange={this.handleChange}
                    />
                </Form>
            </div>
        );
    }
}

export default OtherVarForm;

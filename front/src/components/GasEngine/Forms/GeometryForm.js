import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Message} from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class GeometryForm extends Component {
    handleChange = (e) => {
        this.props.gasEngineStore.input[e.target.name] = e.target.value;
    };

    render() {
        const {input} = this.props.gasEngineStore;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Геометрия бгд:'
                />
                <Form className='attached fluid segment'>
                    <Input
                        label='Угол наклона газового отверстия'
                        dimension='градусы'
                        name='ψ'
                        value={input.ψ}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Диаметр газовой трубки'
                        dimension='мм'
                        name='d_ц'
                        value={input.d_ц}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Диаметр поршня'
                        dimension='мм'
                        name='d_п'
                        value={input.d_п}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Диаметр газового отверстия'
                        dimension='мм'
                        name='d_0'
                        value={input.d_0}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Длина газового отверстия'
                        dimension='мм'
                        name='l_гп'
                        value={input.l_гп}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='Расстояние от казенного среза до газового отверстия'
                        dimension='мм'
                        name='l_го'
                        value={input.l_го}
                        onChange={this.handleChange}
                    />

                    {/*<Input*/}
                        {/*label='Расстояние от стенки газовой трубки до поршня'*/}
                        {/*dimension='мм'*/}
                        {/*name='l_пп'*/}
                        {/*value={input.l_пп}*/}
                        {/*onChange={this.handleChange}*/}
                    {/*/>*/}
                </Form>
            </div>
        );
    }
}

export default GeometryForm;

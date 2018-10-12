import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Message} from 'semantic-ui-react';
import Input from '../../Input';

@inject('gasEngineStore')
@observer
class TimeForm extends Component {
    handleChange = (e) => {
        this.props.gasEngineStore.input[e.target.name] = e.target.value;
    };

    render() {
        const {input} = this.props.gasEngineStore;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Циклограмма работы автоматики:'
                />
                <Form className='attached fluid segment'>
                    <Input
                        label='время свободного хода'
                        dimension='с'
                        name='t_сх'
                        value={input.t_сх}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='время отпирания'
                        dimension='с'
                        name='t_отп'
                        value={input.t_отп}
                        onChange={this.handleChange}
                    />
                </Form>
            </div>
        );
    }
}

export default TimeForm;

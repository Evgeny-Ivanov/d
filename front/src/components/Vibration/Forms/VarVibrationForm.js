import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Message} from 'semantic-ui-react';
import Input from '../../Input';

@inject('vibrationStore')
@observer
class GeometryForm extends Component {
    handleChange = (e) => {
        this.props.vibrationStore.varInput[e.target.name] = e.target.value;
    };

    render() {
        const {varInput} = this.props.vibrationStore;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Параметры необходимые для расчета разных положений:'
                />
                <Form className='attached fluid segment'>
                    <Input
                        label='количество точек для варьирования положения газовой каморы'
                        dimension=''
                        name='n_dx_г'
                        value={varInput.n_dx_г}
                        onChange={this.handleChange}
                    />
                </Form>
            </div>
        );
    }
}

export default GeometryForm;

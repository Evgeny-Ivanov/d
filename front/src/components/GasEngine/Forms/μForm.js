import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Checkbox, Form, Message} from 'semantic-ui-react';
import {μMap} from '../../../stores/gasEngineStore';

@inject('gasEngineStore')
@observer
class μForm extends Component {
    handleChange = (e, {value}) => {
        this.props.gasEngineStore.input.μFormula = value;
    };

    render() {
        const {μFormula} = this.props.gasEngineStore.input;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Формула μ:'
                />
                <Form className='attached fluid segment'>
                    <Form.Field>
                        <Checkbox
                            radio
                            name='μ'
                            label='Формула Ижевск'
                            value={μMap.izhevsk}
                            checked={μFormula === μMap.izhevsk}
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Checkbox
                            radio
                            name='μ'
                            label='Формула Кириллова'
                            value={μMap.kirillov}
                            checked={μFormula === μMap.kirillov}
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Checkbox
                            radio
                            name='μ'
                            label='Формула Орлова'
                            value={μMap.orlov}
                            checked={μFormula === μMap.orlov}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                </Form>
            </div>
        );
    }
}

export default μForm;

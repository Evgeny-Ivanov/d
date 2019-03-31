import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Message, Checkbox} from 'semantic-ui-react';
import Input from '../../Input';

@inject('vibrationStore')
@observer
class GeometryForm extends Component {
    handleChange = (e) => {
        this.props.vibrationStore.input[e.target.name] = e.target.value;
    };

    render() {
        const {input} = this.props.vibrationStore;
        return (
            <div className='flex-item'>
                <Message
                    attached
                    header='Параметры необходимые для расчета колебаний:'
                />
                <Form className='attached fluid segment'>
                    <Input
                        label='Модуль Юнга'
                        name='e'
                        value={input.e}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='плотность материала ствола'
                        dimension='кг/м³'
                        name='ro'
                        value={input.ro}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='наружный диаметр ствола'
                        dimension='мм'
                        name='d1'
                        value={input.d1}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='масса газовой каморы'
                        dimension='кг'
                        name='q1'
                        value={input.q1}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='масса надульного устройства'
                        dimension='кг'
                        name='q2'
                        value={input.q2}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='масса пули'
                        dimension='г'
                        name='gp'
                        value={input.gp}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='соотношение между шагом по времени и координате'
                        dimension=''
                        name='cit'
                        value={input.cit}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='плечо момента от силы газовой каморы'
                        dimension='мм'
                        name='h_г'
                        value={input.h_г}
                        onChange={this.handleChange}
                    />

                    <Input
                        label='на сколько точек по координате разделять длину ствола'
                        dimension=''
                        name='n_dx'
                        value={input.n_dx}
                        onChange={this.handleChange}
                    />

                    <Checkbox
                        label='Учитывать силу от газовой камеры'
                        onChange={() => {input.with_gas_engine = input.with_gas_engine ? 0 : 1}}
                        checked={input.with_gas_engine}
                    />
                </Form>
            </div>
        );
    }
}

export default GeometryForm;

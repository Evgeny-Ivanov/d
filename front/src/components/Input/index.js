import React from 'react';
import { Form, Input } from 'semantic-ui-react';
import './style.css';

const CustomInput = ({
  label, dimension, name, value, onChange,
}) => {
  const dimensionPropsDefault = {
    label: { basic: true, content: dimension },
    labelPosition: 'right',
  };

  const dimensionProps = dimension ? dimensionPropsDefault : {};

  return (
    <Form.Field>
      <label className='custom-input-label'>{label}</label>
      <Input
        {...dimensionProps}
        size='mini'
        required
        type='text'
        pattern='^[ 0-9]+$'
        name={name}
        value={value}
        onChange={onChange}
      />
    </Form.Field>
  );
};

export default CustomInput;

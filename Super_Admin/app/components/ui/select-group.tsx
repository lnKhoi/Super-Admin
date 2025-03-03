import React from 'react';

import Select from 'react-select';
import { Option } from '~/constants/auth.constant';

import { Label } from './label';

type SelectGroupProps = {
    value: string[],
    options: Option[]
    label?: string
    onChange(value: string[]): void
}
const SelectGroup = ({ value, onChange, label, options }: SelectGroupProps) => (
    <>
        <Label>{label}</Label>
        <Select
            className='mt-1'
            isMulti
            placeholder='--select--'
            options={options}
            value={options.filter(option => value.includes(option.value))}
            onChange={(selectedOptions) => {
                onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
            }}
        />
    </>
);
export default SelectGroup;
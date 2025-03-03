import { ChangeEvent } from 'react';

import {
  Col,
  Input,
  Row,
} from 'antd';

interface AgeRangeInputProps {
    value?: { min?: string; max?: string };
    onChange?: (value: { min?: string; max?: string }) => void;
}

export const AgeRangeInput = ({ value = {}, onChange }: AgeRangeInputProps) => {
    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const minAge = e.target.value;
        onChange?.({ ...value, min: minAge });
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxAge = e.target.value;
        onChange?.({ ...value, max: maxAge });
    };

    return (
        <Row gutter={8}>
            <Col span={12}>
                <Input
                    placeholder="Min age"
                    value={value.min}
                    onChange={handleMinChange}
                    type="number"
                />
            </Col>
            <Col span={12}>
                <Input
                    placeholder="Max age"
                    value={value.max}
                    onChange={handleMaxChange}
                    type="number"
                />
            </Col>
        </Row>
    );
};
import React, { useEffect } from 'react';

import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  message,
} from 'antd';
import {
  DECIMAL_REGEX,
  PERCENT_REGEX,
} from '~/constants/regex.constant';
import { CustomConfig } from '~/models/configuration.model';

type PaymentProps = {
    mainConfig: CustomConfig
}

function Payment({ mainConfig }: PaymentProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (mainConfig) {
            form.setFieldsValue(mainConfig.payment);
        }
    }, [mainConfig]);

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        message.success('Payment configuration saved successfully!');
    };

    return (
        <div className='max-w-[816px]'>
            <h6 className='text-gray-900 text-xl font-medium'>Payment</h6>
            <p className='text-xs text-gray-700 mt-2'>Payment Configuration</p>
            <Form
                labelCol={{ flex: '110px' }}
                labelAlign="left"
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                layout="horizontal"
                form={form}
                onFinish={onFinish}
                className='mt-12 p-6 pt-8 pb-3 shadow-md w-full border flex flex-col gap-5 border-gray-200 rounded-lg'>
                <Form.Item
                    label={
                        <div className='flex flex-col items-start w-[256px]'>
                            <p className='text-[14px] text-gray-800 font-medium'>Commission Fee (%)</p>
                            <p className='max-w-[256px] text-gray-500 text-xs mt-1'>Fee brands pay per active influencer and influencer pay to join a campaign</p>
                        </div>
                    }
                    name='commissionFee'
                    rules={[{ required: true, message: 'Commission fee is required' }, { pattern: PERCENT_REGEX, message: 'Enter a valid percentage (0.00 - 100)' }]}
                >
                    <InputNumber min={0} max={100} step={0.01} placeholder='0.00' className='w-full' suffix='%' />
                </Form.Item>

                <Form.Item
                    label={
                        <div className='w-[256px] flex items-start flex-col'>
                            <p className='text-[14px] text-gray-800 font-medium'>Monthly Fee ($)</p>
                            <p className='max-w-[256px] text-gray-500 text-xs mt-1'>A fixed monthly fee that users must pay</p>
                        </div>
                    }
                    name='monthlyFee'
                    rules={[{ required: true, message: 'Monthly fee is required' }, { pattern: DECIMAL_REGEX, message: 'Allows nunbers with up to 2 decimal' }]}
                >
                    <InputNumber min={0} max={999999} step={0.01} className='flex-1 w-full' placeholder='0.00' suffix='$' />
                </Form.Item>

                <Form.Item
                    label={
                        <div className='w-[256px] flex flex-col items-start'>
                            <p className='text-[14px] text-gray-800 font-medium'>Credit Fee (%)</p>
                            <p className='max-w-[256px] text-gray-500 text-xs mt-1'>A percentage-based fee applied to credit transactions</p>
                        </div>
                    }
                    name='creditFee'
                    rules={[{ required: true, message: 'Credit fee is required' }, { pattern: PERCENT_REGEX, message: 'Enter a valid percentage (0.00 - 100)' }]}
                >
                    <InputNumber min={0} max={100} step={0.01} placeholder='0.00' className='w-full' suffix='%' />
                </Form.Item>

                <Form.Item
                 rules={[{ required: true, message: 'Please select payment method' }]} 
                label={<div className='w-[256px] flex items-start flex-col min-w-[256px]'>
                    <p className='text-[14px] text-gray-800 font-medium'>Payment Methods</p>
                    <p className='max-w-[256px] text-gray-500 text-xs mt-1'>Supported payment methods</p>
                </div>}
                 name='paymentMethod'
                  className='mb-0'>
                            <Checkbox.Group  >
                    <div className='flex items-center gap-5 justify-between'>
                        <div className='flex items-center w-full gap-3'>
                                <Checkbox value='credit-card'>Credit Card</Checkbox>
                                <Checkbox value='paypal'>PayPal</Checkbox>
                        </div>
                    </div>
                            </Checkbox.Group>
                </Form.Item>

                <div className='w-full justify-end flex'>
                    <Button type='primary' htmlType='submit' className='w-[105px]'>Save Changes</Button>
                </div>
            </Form>
        </div>
    );
}

export default Payment;

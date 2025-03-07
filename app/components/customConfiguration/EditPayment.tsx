import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  message,
  Skeleton,
} from 'antd';
import { updateCustomConfig } from '~/apis/configuration';
import {
  DECIMAL_REGEX,
  PERCENT_REGEX,
} from '~/constants/regex.constant';
import { CustomConfig } from '~/models/configuration.model';

type EditPaymentProps = {
    paymentInfo: CustomConfig
    loading: boolean
    onSuccess: (newConfig: CustomConfig) => void
}

function EditPayment({ paymentInfo, loading, onSuccess }: EditPaymentProps) {
    const [edit, setEdit] = useState<boolean>(false)
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)

    const [form] = Form.useForm();

    useEffect(() => {
        paymentInfo && form.setFieldsValue(paymentInfo.payment)
    }, [paymentInfo])


    const onFinish = (values: CustomConfig) => {
        setLoadingUpdate(true)
        updateCustomConfig(paymentInfo.id as string, values)
            .then((res) => {
                message.success('Update Payment successfully!')
                onSuccess(res.data)
                setEdit(false)
            })
            .finally(() => setLoadingUpdate(false))
            .catch(err => message.error(err.message))
    };


    return (
        <div className=' rounded-xl shadow-md border border-gray-200'>
            <div className='flex bg-gray-100 p-3  items-center justify-between h-[53px]'>
                <p className='font-medium'>Payment</p>
                {!edit && <Button onClick={() => setEdit(true)} type='primary'>Edit</Button>}
            </div>

            {/* Payment Info */}
            {!edit && (
                <div className='p-5 grid grid-cols-2 gap-5'>
                    <div>
                        <p className='text-gray-500 font-medium text-sm'>Commission Fee</p>
                        <span className='text-gray-800 font-medium text-sm'>
                            {loading ? <Skeleton.Input active style={{ height: 17 }} /> : paymentInfo?.payment?.commissionFee?.toFixed(2) + '%'}
                        </span>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium text-sm'>Credit Fee</p>
                        <span className='text-gray-800 font-medium text-sm'>
                            {loading ? <Skeleton.Input active style={{ height: 17 }} /> : paymentInfo?.payment?.creditFee?.toFixed(2) + '%'}
                        </span>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium text-sm'>Monthly Fee</p>
                        <span className='text-gray-800 font-medium text-sm'>
                            {loading ? <Skeleton.Input active style={{ height: 17 }} /> : `$` + paymentInfo?.payment?.monthlyFee?.toFixed(2) + '/month'}
                        </span>
                    </div>
                    <div>
                        <p className='text-gray-500 font-medium text-sm'>Payment Methods</p>
                        <span className='text-gray-800 font-medium text-sm capitalize'>
                            {loading ? <Skeleton.Input active style={{ height: 17 }} /> : paymentInfo?.payment.paymentMethod?.join(', ')}
                        </span>
                    </div>
                </div>
            )}
            {/* Edit Payment */}
            {edit && (
                <Form
                    labelCol={{ flex: '110px' }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{ flex: 1 }}
                    colon={false}
                    layout="horizontal"
                    form={form}
                    onFinish={onFinish}
                    className='w-full p-5 mt-4 flex flex-col gap-5'>
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
                        <InputNumber min={0} max={99999999} step={0.01} className='flex-1 w-full' placeholder='0.00' suffix='$' />
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

                    <div className='w-full justify-end flex gap-3'>
                        <Button onClick={() => setEdit(false)}>Cancel</Button>
                        <Button loading={loadingUpdate} type='primary' htmlType='submit' className='w-[105px]'>Save</Button>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default EditPayment

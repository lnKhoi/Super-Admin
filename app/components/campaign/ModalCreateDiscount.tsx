import 'tailwindcss/tailwind.css';

import { useState } from 'react';

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { createDiscount } from '~/apis/shopify';
import { Product } from '~/models/shopify.model';

const { Option } = Select;

type ModalCreateDiscountProps = {
    products: Product[]
    shopId: string
    open: boolean
    onClose: () => void
    onrefresh: () => void
}

type TargetOption = 'all' | 'entitled'

const ModalCreateDiscount = ({ products, shopId, open, onClose, onrefresh }: ModalCreateDiscountProps) => {
    const [targetOptions, setTargetOptions] = useState<TargetOption>('all');
    const [discountPrefix, setDiscountPrefix] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm();
    const startDate = Form.useWatch('startsAt', form)
    const discountType = Form.useWatch('discountType')


    const handleFinish = (values: any) => {
        setLoading(true)

        const payload = {
            ...values,
            value: discountType === 'free_shipping' ? 100 : values.value,
            startsAt: dayjs(values.startsAt).toISOString(),
            endsAt: dayjs(values.endsAt).toISOString()
        }

        createDiscount(shopId, payload)
            .then(() => {
                toast.success('Create Discount Success!')
                form.resetFields()
                onClose()
                onrefresh()

            })
            .catch((err => toast.error(`Create Discount Failed - ${err?.message}`)))
            .finally(() => setLoading(false))
    };

    const handleValuesChange = (changedValues: any, allValues: any) => {
        if (changedValues.discountType) {
            if (changedValues.discountType === 'fixed_amount') {
                setDiscountPrefix('$');
            } else if (changedValues.discountType === 'percentage') {
                setDiscountPrefix('%');
            } else {
                setDiscountPrefix(null);
            }
        }
    };

    const disabledEndDate = (current: Dayjs) => {
        if (!startDate) return false;
        const minEndDate = startDate.add(1, 'day');
        return current && current.isBefore(minEndDate, 'day');
    };

    return (
        <>
            <ToastContainer />
            <Modal
                open={open}
                onCancel={() => onClose()}
                width={650}
                className="text-center h-[500px]"
                footer={[
                    <div className="flex border-t border-t-gray-300 pt-5 items-center justify-end gap-2">
                        <Button onClick={() => onClose()}>Cancel</Button>
                        <Button loading={loading} disabled={loading} type="primary" htmlType="submit" form="createDiscountForm">Create</Button>
                    </div>
                ]}
            >
                <h2 className="text-xl font-semibold mb-4">Create Discount</h2>
                <Form
                    form={form}
                    id="createDiscountForm"
                    layout="vertical"
                    onFinish={handleFinish}
                    onValuesChange={handleValuesChange}
                    className="space-y-4 px-4 h-[500px] overflow-y-scroll"
                >
                    <div className="text-lg font-semibold text-left">General Information</div>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter a title" }]}>
                        <Input className="bg-gray-100 border-none" placeholder="Enter title" />
                    </Form.Item>

                    <div className='flex items-center gap-4'>
                        <Form.Item className='w-1/2' label="Start date" name="startsAt" rules={[{ required: true, message: "Please select a start date" }]}>
                            <DatePicker
                                onChange={() => form.setFieldValue('endsAt', null)}
                                disabledDate={(current) => current && current.isBefore(new Date().setHours(0, 0, 0, 0))}
                                className='bg-gray-100 w-full border-none' />
                        </Form.Item>

                        <Form.Item className='w-1/2' label="End date" name="endsAt" rules={[{ required: true, message: "Please select an end date" }]}>
                            <DatePicker disabledDate={disabledEndDate} className='bg-gray-100 w-full border-none' />
                        </Form.Item>
                    </div>

                    <div className="text-lg font-semibold mb-2 text-left">Discount Configuration</div>
                    <div className='w-full flex items-center gap-4'>
                        <Form.Item className='w-1/2' label="Discount Type" name="discountType"
                            rules={[{ required: true, message: "Please select a discount type" }]}>
                            <Select style={{ textAlign: 'left' }} className="custom-select" placeholder="Select option">
                                <Option value="fixed_amount">Fixed Amount</Option>
                                <Option value="percentage">Percentage</Option>
                                {/* <Option value="free_shipping">Free Shipping</Option> */}
                            </Select>
                        </Form.Item>

                        {/* Conditional Discount Value Field */}
                        {discountPrefix && (
                            <Form.Item className='w-1/2' label={discountPrefix === '%' ? 'Percentage' : 'Dollar'} name="value" rules={[{ required: true, message: "Please enter a discount value" }]}>
                                <InputNumber
                                    min={1}
                                    precision={0}
                                    prefix={discountPrefix}
                                    className="bg-gray-100 border-none w-full"
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div className="text-lg font-semibold mb-2 text-left">Eligibility and Applicability</div>
                    <div className='w-full flex flex-col items-start justify-start gap-4'>
                        <label><span className='text-red-500'>*</span> Target Selection</label>
                        <Radio.Group onChange={(e) => setTargetOptions(e.target.value)} className='w-full flex items-start' defaultValue={'all'}>
                            <Radio value='all'>All</Radio>
                            <Radio value='entitled'>Entitled</Radio>
                        </Radio.Group>
                    </div>
                    {targetOptions === 'entitled' && (
                        <Form.Item className='w-full ' label="Products" name="productIds" rules={[{ required: true, message: "Please select a target selection" }]}>
                            <Select

                                style={{ textAlign: 'left' }}
                                placeholder="Select option"
                                mode="multiple"
                                className="custom-select w-full"
                                options={products?.map((product) => ({
                                    value: String(product.id),
                                    label: (
                                        <div className="flex items-center">
                                            <img
                                                src={product.thumbnail.src}
                                                alt={product.title}
                                                className="w-4 h-4 mr-2"
                                            />
                                            {product.title}
                                        </div>
                                    ),
                                }))}
                            />
                        </Form.Item>
                    )}
                    <Form.Item label="Allocation Method" name="allocationMethod" rules={[{ required: true, message: "Please select an allocation method" }]}>
                        <Select style={{ textAlign: 'left' }} className="custom-select" placeholder="Select option">
                            {targetOptions == 'entitled' && <Option value="each">Each</Option>}
                            <Option value="across">Across</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Customer Selection" name="customerSelection" rules={[{ required: true, message: "Please select a customer selection" }]}>
                        <Select className="custom-select" style={{ textAlign: 'left' }} placeholder="Select option">
                            <Option value="all">All</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item initialValue={1} label="Usage Limit" name="usageLimit">
                        <InputNumber min={1}  placeholder='1' className='bg-gray-100 w-full border-none' />
                    </Form.Item>
                    <div className='flex pb-5 items-start'>
                        <div className='flex pb-5 items-start'>
                            <Form.Item name="oncePerCustomer" valuePropName="checked">
                                <Checkbox checked>Once Per Customer</Checkbox>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default ModalCreateDiscount;

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd';
import { getBrands } from '~/apis/brand';
import { createCustomConfig } from '~/apis/configuration';
import Shopify from '~/assets/shopify.png';
import Woo from '~/assets/woo.png';
import { configMethods } from '~/constants/config.constant';
import {
  DECIMAL_REGEX,
  PERCENT_REGEX,
} from '~/constants/regex.constant';
import { CustomConfig } from '~/models/configuration.model';
import { User } from '~/models/User.model';

type ModalAddCustomConfigProps = {
  open: boolean,
  onclose: () => void
  onSuccess: (newConfig: CustomConfig) => void
}

type Method = 'Payment' | 'Integration Setup'
function ModalAddCustomConfig({ onclose, open, onSuccess }: ModalAddCustomConfigProps) {
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = useState<Method>('Payment')
  const [loading, setLoading] = useState<boolean>(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [brands, setBrands] = useState<User[]>([])

  const handlegGetBrands = () => {
    getBrands().then(res => setBrands(res.data.data))
  }

  const onFinish = (values: any) => {
    setLoading(true)
    const formattedData = {
      name: values.name,
      payment: {
        commissionFee: Number(values.commissionFee),
        monthlyFee: Number(values.monthlyFee),
        creditFee: Number(values.creditFee),
        paymentMethod: values.integration
      },
      integration: values.integrationSetup,
      brands: values.brands || [],
    };

    createCustomConfig(formattedData).then(res => {
      onclose()
      onSuccess(res.data)
    })
      .catch(err => messageApi.error(err.message))
      .finally(() => setLoading(false))
  };

  useEffect(() => {
    handlegGetBrands()
  }, [])

  return (
    <Drawer
      title='Add Custom Configure'
      width={650}
      open={open}
      onClose={onclose}
      footer={<div className='w-full justify-end gap-2 flex'>
        <Button onClick={onclose} >Cancel</Button>
        <Button loading={loading} onClick={() => form.submit()} htmlType='submit' type='primary' >Create</Button>
      </div>}
    >
      {contextHolder}
      <Form labelCol={{ flex: '110px' }}
        labelAlign="left"
        labelWrap
        onFinishFailed={() => message.warning('Please enter complete information!')}
        wrapperCol={{ flex: 1 }}
        colon={false}
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        className='w-full flex flex-col gap-5'>
        <Form.Item
          label="Name"
          name="name"
          style={{ marginBottom: 0 }}
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input maxLength={120} placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brands"
          style={{ marginBottom: 4 }}
          labelCol={{ span: 24 }}
          rules={[{ required: true, message: "Brand is required" }]}
        >
          <Select maxTagCount={2} mode='multiple' placeholder="Select a brand">\
            {brands?.map(b => (
              <Select.Option key={b?.id} value={b?.id}>{b?.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className='flex items-center mb-1 gap-2'>
          {configMethods.map(c => (
            <div
              key={c.label}
              onClick={() => setSelectedMethod(c.label as Method)}
              className={`w-[176px] ${selectedMethod == c.label ? 'border-blue-500 bg-[#f6f6f6]' : 'border-gray-200'} cursor-pointer h-[74px] flex flex-col items-center py-2 justify-around border rounded-md`}>
              {c.icon}
              <p className='text-sm font-normal text-black'>{c.label}</p>
            </div>
          ))}

        </div>
        {/* PAYMENT */}
        <div className={`border border-gray-200 flex flex-col gap-3 rounded-md px-3 py-9  ${selectedMethod == 'Payment' ? 'block' : 'hidden'}`}>
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
            rules={[{ required: true, message: 'Please select at least one payment method' }]}
            label={
              <div className='w-[256px] flex items-start flex-col min-w-[256px]'>
                <p className='text-[14px] text-gray-800 font-medium'>Payment Methods</p>
                <p className='max-w-[256px] text-gray-500 text-xs mt-1'>Supported payment methods</p>
              </div>
            }
            name='integration' // Ensure this matches what you're expecting in `onFinish`
            className='mb-0'
          >
            <Checkbox.Group className="w-full flex">
              <Checkbox value='credit-card'>Credit Card</Checkbox>
              <Checkbox value='paypal'>PayPal</Checkbox>
            </Checkbox.Group>
          </Form.Item>

        </div>
        {/* INTEGRATION SETUP */}
        <div className={`${selectedMethod == 'Payment' ? 'hidden' : 'block'} `}>
          <Form.Item
            rules={[{ required: true, message: '' },]}
            name="integrationSetup"
            required
          >
            <Checkbox.Group className="w-full flex">
              <div className='flex items-start gap-6'>
                <div className="rounded-lg border w-full flex items-start justify-between gap-3 border-gray-200 p-4 shadow-sm">
                  <img src={Shopify} className="w-12 h-12 object-cover" alt="shopify" />
                  <div>
                    <p className="text-base font-medium text-black">Shopify</p>
                    <p className="mt-2 text-sm text-gray-500">
                      E-commerce platform for building and managing online stores with ease.
                    </p>
                  </div>
                  <Checkbox value="shopify" />
                </div>

                <div className="rounded-lg border w-full flex items-start justify-between gap-3 border-gray-200 p-4 shadow-sm">
                  <img src={Woo} className="w-12 h-12 object-cover" alt="woocommerce" />
                  <div>
                    <p className="text-base font-medium text-black">WooCommerce</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Powerful WordPress plugin for creating and managing online stores.
                    </p>
                  </div>
                  <Checkbox value="woocommerce" />
                </div>
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>

      </Form>
    </Drawer>
  )
}

export default ModalAddCustomConfig

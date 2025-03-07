import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Checkbox,
  Form,
  message,
  Skeleton,
} from 'antd';
import { updateIntegration } from '~/apis/configuration';
import Shopify from '~/assets/shopify.png';
import Woo from '~/assets/woo.png';
import { CustomConfig } from '~/models/configuration.model';

type EditIntegrationSetupProps = {
    paymentInfo: CustomConfig
    loading: boolean
    onSuccess: (newCustomConfig: CustomConfig) => void
}

function EditIntegrationSetup({ paymentInfo, loading, onSuccess }: EditIntegrationSetupProps) {
    const [edit, setEdit] = useState<boolean>(false)
    const [form] = Form.useForm();
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false)

    useEffect(() => {
        if (paymentInfo) {
          form.setFieldsValue({ integration: paymentInfo.integration });
        }
      }, [paymentInfo, form]);
      
    const onFinish = (values: CustomConfig) => {
        setLoadingEdit(true)
        updateIntegration(paymentInfo.id as string, values)
            .then((res) => { 
                onSuccess(res.data); 
                message.success('Update Integration successfully!')
                setEdit(false)
             })
            .catch(err => message.error(err.message))
            .finally(() => setLoadingEdit(false))
    };

    return (
        <div className='rounded-xl shadow-md border border-gray-200'>
            <div className='flex bg-gray-100 h-[53px] p-3  items-center justify-between'>
                <p className='font-medium'>Intergration Setup</p>
                {!edit && <Button onClick={() => setEdit(true)} type='primary'>Edit</Button>}
            </div>
            {/* Info */}
            {!edit && (
                <div className='grid grid-cols-2 gap-3 p-5'>
                    {loading
                        ? <>
                            <Skeleton.Node active style={{ width: '100%' }} />
                            <Skeleton.Node active style={{ width: '100%' }} />
                        </>
                        : <>
                            {paymentInfo?.integration?.includes('shopify') && (
                                <div className="rounded-lg border w-full flex items-start justify-between gap-3 border-gray-200 p-4 shadow-sm">
                                    <img src={Shopify} className="w-12 h-12 object-cover" alt="woocommerce" />
                                    <div>
                                        <p className="text-base font-medium text-black">Shopify</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            E-commerce platform for building and managing online stores with ease.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {paymentInfo?.integration?.includes('woocommerce') && (
                                <div className="rounded-lg border w-full flex items-start justify-between gap-3 border-gray-200 p-4 shadow-sm">
                                    <img src={Woo} className="w-12 h-12 object-cover" alt="woocommerce" />
                                    <div>
                                        <p className="text-base font-medium text-black">WooCommerce</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Powerful WordPress plugin for creating and managing online stores.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    }
                </div>
            )}
            {/* Edit */}
            {edit && (
                <div className='p-5'>
                    <Form labelCol={{ flex: '110px' }}
                        labelAlign="left"
                        labelWrap
                        onFinishFailed={() => message.warning('Please select minimum 1 item!')}
                        wrapperCol={{ flex: 1 }}
                        colon={false}
                        layout="horizontal"
                        form={form}
                        onFinish={onFinish}
                        className='w-full flex flex-col gap-5'>

                        <Form.Item
                            rules={[{ required: true, message: '' },]}
                            name="integration"
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
                        <div className='w-full justify-end flex items-center mt-12 gap-3'>
                            <Button onClick={() => setEdit(false)}>Cancel</Button>
                            <Button loading={loadingEdit} htmlType='submit' type='primary' className='min-w-[65px]  float-right flex justify-end'>Save</Button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    )
}

export default EditIntegrationSetup

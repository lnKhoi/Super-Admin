import React from 'react';

import {
  Button,
  Skeleton,
} from 'antd';
import Shopify from '~/assets/shopify.png';
import Woo from '~/assets/woo.png';
import { CustomConfig } from '~/models/configuration.model';

type EditIntegrationSetupProps = {
    paymentInfo: CustomConfig
    loading: boolean
}

function EditIntegrationSetup({ paymentInfo, loading }: EditIntegrationSetupProps) {
    return (
        <div className='rounded-xl shadow-md border border-gray-200'>
            <div className='flex bg-gray-100 p-3  items-center justify-between'>
                <p className='font-medium'>Intergration Setup</p>
                <Button type='primary'>Edit</Button>
            </div>
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
        </div>
    )
}

export default EditIntegrationSetup

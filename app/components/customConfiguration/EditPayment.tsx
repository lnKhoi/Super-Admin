import React from 'react';

import {
  Button,
  Skeleton,
} from 'antd';
import { CustomConfig } from '~/models/configuration.model';

type EditPaymentProps = {
    paymentInfo: CustomConfig
    loading: boolean
}
function EditPayment({ paymentInfo, loading }: EditPaymentProps) {

    return (
        <div className=' rounded-xl shadow-md border border-gray-200'>
            <div className='flex bg-gray-100 p-3  items-center justify-between'>
                <p className='font-medium'>Payment</p>
                <Button type='primary'>Edit</Button>
            </div>
            <div className='p-5 grid grid-cols-2 gap-5'>
                {/* Payment Info */}
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
                    {loading ? <Skeleton.Input active style={{ height: 17 }} /> : paymentInfo?.integration?.join(', ') }
                    </span>
                </div>
                {/* Edit Payment */}

            </div>
        </div>
    )
}

export default EditPayment

import React, {
  useEffect,
  useState,
} from 'react';

import { Table } from 'antd';
import { getOrdersInCampagin } from '~/apis/shopify';
import { InputSearch } from '~/components/ui/input-search';
import { OrderTrackingColumns } from '~/constants/product.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Order } from '~/models/shopify.model';

import {
  AdjustmentsHorizontalIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from '@remix-run/react';

function OrderTracking() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const {userInfo,hasPermission} = useAuthContext()
    const navigate = useNavigate()

    const handleSearchProducts = (e: string) => {
    }

    const handleGetOrdersTracking = () => {
        setLoading(true)
        getOrdersInCampagin().then(res => setOrders(res?.data?.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        handleGetOrdersTracking()
    }, [])

    useEffect(() => {
        userInfo && !hasPermission('view-influencer-orders') && navigate('/page-not-found')
    },[userInfo])

    return (
        <div>
            <div className='flex mb-5 items-end justify-between'>
                <InputSearch onChange={(e) => handleSearchProducts(e.target.value)} placeholder='Influencer, product, or campaign' className='w-[300px] h-[36px] ' />
                <div className='flex items-center gap-3'>
                    <button className='bg-gray-100 px-3 justify-between flex items-center px hover:bg-gray-300 transition-all text-sm h-[36px] w-[105px] font-normal rounded-[9px] text-gray-800'>
                        All Status
                        <ChevronUpDownIcon width={16} />
                    </button>
                    <button className=' bg-gray-100 hover:bg-gray-300 transition-all flex items-center justify-center gap-1 text-sm h-[36px] w-[87px] font-normal rounded-[9px] text-gray-800'>
                        <AdjustmentsHorizontalIcon width={16} />  Filter
                    </button>
                </div>
            </div>

            {/* List Products */}
            <Table
                columns={OrderTrackingColumns(loading)}
                dataSource={loading ? [1, 2, 3, 4, 5] as any : orders}
            />
        </div>
    )
}

export default OrderTracking

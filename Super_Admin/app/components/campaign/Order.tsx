import React, {
  useEffect,
  useState,
} from 'react';

import { Table } from 'antd';
import { getOrders } from '~/apis/shopify';
import { orderColumns } from '~/constants/campaign.constant';
import { Campaign } from '~/models/Campaign.model';
import type { Order } from '~/models/shopify.model';

import { useParams } from '@remix-run/react';

type OrderProps = {
    campaign: Campaign | null
}

function Order({ campaign }: OrderProps) {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(false)
    const [orders, setOrders] = useState<Order[]>([])

    const handleGetTrackingOrders = () => {
        setLoading(true)
        getOrders(id as string).then(res => setOrders(res?.data?.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        handleGetTrackingOrders()
    }, [])

    return (
        <div>
            <Table
                columns={orderColumns(loading)}
                dataSource={
                    loading ? [1, 2, 3, 4, 5] as any : orders
                }
            />
        </div>
    )
}

export default Order

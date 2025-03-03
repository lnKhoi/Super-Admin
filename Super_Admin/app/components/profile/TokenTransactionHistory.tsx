import React, {
  useEffect,
  useState,
} from 'react';

import { Table } from 'antd';
import { ToastContainer } from 'react-toastify';
import { getTokenTransactionHistory } from '~/apis/stripe';
import { tokenTransactionHistoryColumns } from '~/constants/payment.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { TokenTransaction } from '~/models/payment.model';

function TokenTransactionHistory() {
    const { onPayment } = useAuthContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [params, setParams] = useState<{ page: number, perPage: number }>({ page: 1, perPage: 10 })
    const [paymentHistory, setPaymentHistory] = useState<{ total: number, data: TokenTransaction[] }>({ total: 0, data: [] })

    const handleGetPaymentHistory = () => {
        setLoading(true)
        getTokenTransactionHistory(params.page, params.perPage).then(res => setPaymentHistory({ total: res.data.total, data: res?.data?.data }))
            .finally(() => setLoading(false))
    }

    useEffect(() => handleGetPaymentHistory(), [params, onPayment])

    return (
        <div>
            <p className='text-lg font-semibold text-gray-800 mb-6'>Token Transaction History</p>
            <ToastContainer />
            <Table
                columns={tokenTransactionHistoryColumns(loading)}
                dataSource={loading ? Array(10).fill({}) : paymentHistory.data}
                rowKey="id"
                onChange={(e) => setParams({ ...params, page: e.current as number })}
                pagination={{
                    total: paymentHistory.total,
                    pageSize: 10,
                    showSizeChanger: false,
                    defaultCurrent: 1,
                }}
            />
        </div>
    );
}

export default TokenTransactionHistory;

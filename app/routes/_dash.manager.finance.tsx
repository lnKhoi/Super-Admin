import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import {
  Skeleton,
  Table,
} from 'antd';
import debounce from 'lodash/debounce';
import {
  getCampaignsInFinance,
  getFinanceMetrics,
} from '~/apis/finance';
import { InputSearch } from '~/components/ui/input-search';
import { FinanceColumns } from '~/constants/finance.constant';
import { useAuthContext } from '~/contexts/auth.context';
import {
  CampaignsInFinance,
  FinanceMetrics,
} from '~/models/finance.model';

import {
  MetaFunction,
  useNavigate,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [{ title: 'Finance' }];
};

function Finance() {
    const [search, setSearch] = useState<string>('')
    const [loadingMetric, setLoadingMetric] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [financeMetrics, setFinanceMetrics] = useState<FinanceMetrics | null>(null)
    const [campaignsInFinance, setCampaignsInFinance]
        = useState<{ total: number, data: CampaignsInFinance[] }>({ total: 0, data: [] })

    const {hasPermission,userInfo} = useAuthContext()
    const navigate = useNavigate()

    const [params, setParams] = useState<{ page: number, pageSize: number }>({ page: 1, pageSize: 10 })

    const handleSearchCampaigns = debounce((e: ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value)
        setParams({ page: 1, pageSize: 10 })
    }, 500);

    const handleGetFinanceMetrics = () => {
        setLoadingMetric(true)
        getFinanceMetrics().then(res => setFinanceMetrics(res.data))
            .finally(() => setLoadingMetric(false))
    }

    const getMemberInFinance = () => {
        setLoading(true)
        getCampaignsInFinance(params.page, params.pageSize, search)
            .then(res => setCampaignsInFinance({ total: res?.data?.total, data: res?.data?.data }))
            .finally(() => setLoading(false))
    };

    useEffect(() => handleGetFinanceMetrics(), [])
    useEffect(() => { getMemberInFinance() }, [params, search])

    useEffect(() => {
        userInfo && !hasPermission('view-finance-overview') && navigate('/page-not-found')
    },[userInfo])

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-medium text-gray-800'>Finance</h2>
            </div>

            <div className='mt-6 border border-gray-200 grid grid-cols-3 rounded-xl p-6'>
                <div className='flex flex-col'>
                    <p className='text-xs font-medium text-gray-800'>Members</p>
                    <span className='text-lg font-bold text-gray-800 mt-3'>
                        {loadingMetric ? <Skeleton.Input size='small' active /> : financeMetrics?.totalMembers}
                    </span>
                </div>
                <div className='flex flex-col'>
                    <p className='text-xs font-medium text-gray-800'>Payment Amount</p>
                    <span className='text-lg font-bold text-gray-800 mt-3'>
                        {loadingMetric ? <Skeleton.Input size='small' active /> : financeMetrics?.totalPayment?.toFixed(2) + ' Tokens'}
                    </span>
                </div>
                <div className='flex flex-col'>
                    <p className='text-xs font-medium text-gray-800'>Amount Paid</p>
                    <span className='text-lg font-bold text-gray-800 mt-3'>
                        {loadingMetric ? <Skeleton.Input size='small' active /> : financeMetrics?.totalPaid?.toFixed(2) + ' Tokens'}
                    </span>
                </div>
            </div>

            <div className='mt-6 flex items-center gap-3'>
                <p className='font-medium text-base text-gray-800'>{campaignsInFinance.total} Campaigns</p>
                <InputSearch
                    onChange={(e) => handleSearchCampaigns(e)}
                    placeholder='Search campaigns'
                    className='w-[300px] h-[36px] ' />
            </div>

            <div className='mt-6 cursor-pointer'>
                <Table
                    pagination={{
                        pageSize: params.pageSize,
                        current: params.page,
                        total: campaignsInFinance.total,
                        onChange: (page, pageSize) => {
                            setParams({ page: page, pageSize: pageSize })
                        },
                    }}
                    columns={FinanceColumns(loading) as any}
                    dataSource={loading ? Array.from({ length: 10 }, () => ({})) : campaignsInFinance.data
                    }
                />
            </div>
        </div>
    )
}

export default Finance

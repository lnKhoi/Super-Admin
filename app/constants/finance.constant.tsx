import {
  Skeleton,
  TableColumnsType,
} from 'antd';
import dayjs from 'dayjs';
import DefaultAvatar from '~/assets/avatar.jpeg';
import TagColor from '~/components/ui/tagColor';
import {
  CampaignsInFinance,
  MemberInCampaign,
} from '~/models/finance.model';

import { Link } from '@remix-run/react';

import { DATE_TIME_FORMAT } from './time.constant';

export const FinanceColumns = (loading: boolean): TableColumnsType<CampaignsInFinance> => [
    {
        title: 'Campaign',
        render: (_, record) => (
            <Link onClick={() => localStorage.setItem('campaignTab', 'Finance')} to={`/manager/${record.campaignId}`}>
                <p className="text-sm font-medium text-blue-500">
                    {loading ? <Skeleton.Input active size='small' /> : record.campaignName}
                </p>
            </Link>
        ),
    },
    {
        title: 'Payment Recipients',
        render: (_, record) => (
            <span className="text-sm text-gray-800 font-normal">
                {loading ? <Skeleton.Input active size='small' /> : record.totalMembers}
            </span>
        ),
    },
    {
        title: 'Payment Amount',
        render: (_, record) =>
            <>
                <span className="text-sm text-gray-800 font-normal">
                    {loading ? <Skeleton.Input active size='small' /> : record.totalPayment + ' Tokens'}
                </span>
            </>
    },
    {
        title: 'Amount Paid',
        render: (_, record) =>
            <>
                <span className="text-sm text-gray-800 font-normal">
                    {loading ? <Skeleton.Input active size='small' /> : record.totalPaid + ' Tokens'}
                </span>
            </>
    },
    {
        title: 'Action',
        render: (_, record) =>
            <Link to={`/manager/finance-details/${record.campaignId}`}>
                <p className="text-sm text-blue-500 font-normal">
                    {loading ? <Skeleton.Input active size='small' /> : 'View Details'}
                </p>
            </Link>
    },
];


export const FinanceDetailsColumns = (loading: boolean): TableColumnsType<MemberInCampaign> => [
    {
        title: 'Name',
        render: (_, record) => (
            <>
                {loading
                    ? <div className='flex items-center gap-3'>
                        <Skeleton.Avatar active size={'large'} shape='circle' />
                        <Skeleton.Input active size='small' />
                    </div>
                    : <div className='flex items-center gap-3'>
                        <img src={DefaultAvatar} alt="avatar" className='w-[36px] h-[36px] rounded-[50%]' />
                        <div className='flex flex-col'>
                            <p className='text-sm font-medium text-gray-800'>{record.creatorName}</p>
                            <span className='text-sm font-normal text-gray-500'>
                                khoilam.dev@gmail.com
                            </span>
                        </div>
                    </div>
                }
            </>
        ),
    },
    {
        title: 'Amount Paid',
        render: (_, record) =>
            <>
                <span className="text-sm text-gray-800 font-normal">
                    {loading ? <Skeleton.Input active size='small' /> : record.amountToPay + ' Tokens'}
                </span>
            </>
    },
    {
        title: 'Payment Date',
        render: (_, record) =>
            <>
                <span className="text-sm text-gray-800 font-normal">
                    {loading
                        ? <Skeleton.Input active size='small' />
                        : record.paymentDate !== '' ? dayjs(record.paymentDate).format(DATE_TIME_FORMAT) : ''}
                </span>
            </>
    },
    {
        title: 'Status',
        render: (_, record) =>
            <>
                {loading
                    ? <Skeleton.Input active size='small' />
                    : <TagColor
                        status={record.status}
                        color={getColorStatusFinance(record.status as FinanceStatus)?.color as string}
                        background={getColorStatusFinance(record.status as FinanceStatus)?.background as string} />}

            </>
    },
];

type FinanceStatus = 'Paid' | 'Pending' | 'Fail';

export const getColorStatusFinance = (status: FinanceStatus) => {
    switch (status) {
        case 'Paid':
            return { background: '#CCFBF1', color: '#0F766E' };
        case 'Pending':
            return { background: '#FFEDD5', color: '#A16207' };
        case 'Fail':
            return { background: '#FFE4E6', color: '#BE123C' };
        default: null
    }
};

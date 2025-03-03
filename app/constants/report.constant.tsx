import {
  Avatar,
  Skeleton,
  TableColumnsType,
} from 'antd';
import { InfluencerInReport } from '~/models/report.model';

type ColumnsProps = {
  loading: boolean
};

export const influencerPerformanceColumns = ({
  loading
}: ColumnsProps): TableColumnsType<InfluencerInReport> => [
    {
      title: 'Name',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Avatar active shape='circle' />
              :
              <div className='flex items-center gap-3'>
                <Avatar src={record.creator?.avatarUrl} className='w-[36px] h-[36px] rounded-[50%]' />
                <div className='flex flex-col items-center'>
                  <p className='text-sm font-medium text-gray-800'>{record?.creator?.name}</p>
                  <p className='text-sm font-normal text-gray-500'>{record?.creator?.email}</p>
                </div>
              </div>
          }
        </div>
    },
    {
      title: 'Engagement Rate',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>{(record?.engagementRate || 0)?.toFixed(2)}%</div>
          }
        </div>
    },
    {
      title: 'Revenue',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>${record?.totalRevenue?.toFixed(2)}</div>
          }
        </div>
    },
    {
      title: 'Clicks',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>{record?.totalClicks}</div>
          }
        </div>
    },
    {
      title: 'Cost Per Click (CPC)',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>${record?.costPerClick?.toFixed(2)}</div>
          }
        </div>
    },
    {
      title: 'Purchases',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>{record?.totalOrders}</div>

          }
        </div>
    },
    {
      title: 'Conversion Rate',
      render: (_, record) =>
        <div>
          {
            loading
              ? <Skeleton.Input active size='small' />
              : <div className='text-sm font-normal text-gray-800'>{record?.conversionRate?.toFixed(2)}%</div>
          }
        </div>
    },
  ];

export const initialReport = {
  conversionRate: 0,
  totalClicks: 0,
  totalRevenue: 0,
  totalImpressions: 0,
  engagementRate: 0,
  roi: 0,
  costPerConversion: 0,
  costPerClicks: 0,
  influencers: [],
  totalCost: 0,
  totalCtr: 0,
  cpa: 0,
  totalPurchases: 0
}

export const initialInfluencerOverLifeTime = {
  conversionRate: 0, totalClicks: 0, influencerAudience: null, revenue: 0, costPerClicks: 0, purchases: 0
}
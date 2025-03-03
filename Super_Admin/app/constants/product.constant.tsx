import {
  Avatar,
  Skeleton,
  TableColumnsType,
} from 'antd';
import DefaultAvatar from '~/assets/avatar.jpeg';
import TagColor from '~/components/ui/tagColor';
import { Order } from '~/models/shopify.model';
import {
  abbreviateLastName,
  formatName,
} from '~/utils/formatNumber';

import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@remix-run/react';

export const OrderTrackingColumns = (loading: boolean): TableColumnsType<Order> => [
  {
    title: 'Influencer name',
    dataIndex: 'influencerName',
    render: (_, record: Order) => (
      <div className="flex items-center gap-3">
        {loading ? (
          <div className="flex items-center gap-3">
            <Skeleton.Avatar active shape="circle" className="w-9 h-9" />
            <Skeleton.Input active size="small" className="w-24" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar
              src={record?.avatar || DefaultAvatar}
              className="w-9 h-9"
            />
            <span className="text-sm font-medium text-gray-800">{formatName(record?.creatorName as string)}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Product',
    render: (_, record) => (
      <div className="flex items-center gap-3">
        {loading ? (
          <Skeleton.Input active size="small" className="w-24" />
        ) : (
          <div className="flex items-center gap-3">
            <img
              src={record?.productImage}
              className="w-[42px] h-[42px] rounded-lg object-cover"
            />
            <span className="text-sm font-medium text-gray-800">{record?.productName}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Product Cost',
    render: (_, record) =>
      <>
        {loading ? <Skeleton.Input active size="small" className="w-24" /> : <span className="text-sm font-medium text-gray-800">${record?.productPrice?.toFixed(2)}</span>}
      </>
  },
  {
    title: 'Shipping Fee',
    render: (_, record) =>
      <>
        {loading ? <Skeleton.Input active size="small" className="w-24" /> : <span className="text-sm font-medium text-gray-800">${record?.shippingFee?.toFixed(2)}</span>}
      </>
  },
  {
    title: 'Campaigns',
    render: (_, record) =>
      <>
        {loading ? <Skeleton.Input active size="small" className="w-24" /> : <span className="text-sm font-medium text-gray-800">{abbreviateLastName(record?.campaignName, 20)}</span>}
      </>

  },
  {
    title: 'Status',
    dataIndex: 'hasAccount',
    key: 'hasAccount',
    render: (_, record) => (
      <div className="flex items-center gap-3">
        {loading ? (
          <Skeleton.Input active size="small" className="w-20" />
        ) : (
          <TagColor status={record?.status} background="#DBEAFE" color="#1D4ED8" />
        )}
      </div>
    ),
  },
  {
    title: 'Actions',
    render: (_, record) => (
      <Link to={`/manager/${record.campaignId}`}>
        <p onClick={() => localStorage.setItem('campaignTab','Order')} className="text-blue-500 cursor-pointer">
          {loading ? (
            <Skeleton.Input active size="small" className="w-24" />
          ) : (
            <div className='w-[36px] h-[36px] rounded-lg bg-gray-200 flex items-center justify-center'>
              <ArrowLongRightIcon className='w-5 h-5 text-gray-800' />

            </div>
          )}
        </p>
      </Link>
    ),
  },
];

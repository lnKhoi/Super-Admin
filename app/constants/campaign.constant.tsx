import {
  Avatar,
  Skeleton,
  TableColumnsType,
} from 'antd';
import {
  FilmIcon,
  PlusCircleIcon,
} from 'lucide-react';
import DefaultAvatar from '~/assets/avatar.jpeg';
import TagColor from '~/components/ui/tagColor';
import { Order } from '~/models/shopify.model';
import { formatName } from '~/utils/formatNumber';

import { Squares2X2Icon } from '@heroicons/react/24/outline';

export const discountOptions = [
  {
    value: 'fixed',
    label: 'Fixed',
  },
  {
    value: 'percentage',
    label: 'Percentage',
  },
];


export const filterFollowerOptions = [
  {
    value: '1',
    label: 'Under 100.000'
  },
  {
    value: '2',
    label: 'From 100.000 - 200.000'
  },
  {
    value: '3',
    label: 'From 200.000 - 500.000'
  },
  {
    value: '4',
    label: 'Over 500.000'
  },
]


export const contentFormatOptions = [
  {
    icon: <Squares2X2Icon width={20} height={20} />,
    label: 'Post',
    value: 'post'
  },
  {
    icon: <FilmIcon width={20} height={20} />,
    label: 'Reel',
    value: 'reel'
  },
  {
    icon: <PlusCircleIcon width={20} height={20} />,
    label: 'Story',
    value: 'story'
  },
]

export const campaignDetailsTabs = [
  { label: 'Campaign Details', value: 'Campaign Details' },
  { label: 'Influencer', value: 'Influencer', permission: 'view-applicants' },
  { label: 'Content', value: 'Content', permission: 'view-content' },
  { label: 'Reports', value: 'Reports', permission: 'view-report' },
  { label: 'Order Tracking', value: 'Order', permission: 'view-influencer-orders' },
  { label: 'Finance', value: 'Finance', permission: 'view-finance-overview' },
]

export const orderColumns = (loading: boolean): TableColumnsType<Order> => [
  {
    title: 'Influencer name',
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
    title: 'Status',
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
];

export const ageRangeCampaign = [
  { label: '18 - 24', value: "18-24" },
  { label: '25 - 32', value: "25-32" },
  { label: '33 - 40', value: "33-40" },
  { label: '41 - 50', value: "41-50" },
]

export const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'All', value: 'all' }
]
export const campaignStatusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archive', value: 'archive' }
]

export const postDurationOptions = [
  { label: '1 Week', value: '1w' },
  { label: '2 Weeks', value: '2w' },
  { label: '1 Month', value: '1m' },
  { label: 'Indefinite', value: 'indefinite' }
]

export const storyDurationOptions = [
  { label: '12 Hours', value: '12h' },
  { label: '24 Hours', value: '24h' },
]

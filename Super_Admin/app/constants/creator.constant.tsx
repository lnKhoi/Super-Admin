import {
  Skeleton,
  TableColumnsType,
  TableProps,
} from 'antd';
import dayjs from 'dayjs';
import DefaultAvatar from '~/assets/avatar.jpeg';
import Ig from '~/assets/insta.svg';
import TagColor from '~/components/ui/tagColor';
import { getColorInfluencerContent } from '~/helpers/campaign.helper';
import {
  Creator,
  InfluencerContentStatus,
  InfluencerInCampaign,
} from '~/models/User.model';
import { formatName } from '~/utils/formatNumber';

import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

import { DATE_TIME_FORMAT } from './time.constant';

export const creatorColumns = (
  toggleEmailVisibility: (email: string) => void,
  hiddenEmails: { [key: string]: boolean }
): TableProps<Creator>['columns'] => [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    minWidth:200,
    render: (email: string) => {
      const isHidden = hiddenEmails[email] ?? true;
      return (
        <div className="flex items-center gap-2">
          <div className="min-w-[100px]">
            {isHidden ? `${email.slice(0, 3)}..........${email.slice(-2)}` : email}
          </div>
          <button onClick={(e) => {toggleEmailVisibility(email);e.stopPropagation()}}>
            {isHidden ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      );
    },
  },
  {
    title: 'Status',
    dataIndex: 'hasAccount',
    key: 'hasAccount',
    render: (hasAccount) => {
      const registered = hasAccount === 1;
      return (
        <div className={`inline-flex items-center px-4 gap-1 rounded-[50px] h-[28px] ${registered ? 'bg-teal-100' : 'bg-red-100'}`}>
          <div className={`w-2 h-2 rounded-full ${registered ? 'bg-teal-700' : 'bg-red-700'}`}></div>
          <span className={`text-[12px] capitalize ${registered ? 'text-teal-700' : 'text-red-700'}`}>
            {registered ? 'Registered' : 'Not Registered'}
          </span>
        </div>
      );
    },
  },
];
export const influencerColumn: TableProps<Creator>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      const isActive = text === 'registered'
      return (
        <div className={`inline-flex items-center px-4   gap-1 rounded-[50px] h-[28px]  ${isActive ? 'bg-teal-100' : 'bg-red-100'} `}>
          <div className={` w-2 h-2 rounded-[50%] ${isActive ? 'bg-teal-700' : 'bg-red-700'}`}></div>
          <span className={`text-[12px] capitalize ${isActive ? 'text-teal-700' : 'text-red-700'}`}>{text}</span>
        </div>
      )
    }
  },
];


export const socials = [
  // {
  //   name: 'facebook',
  //   icon: Fb
  // },
  {
    name: 'instagram',
    icon: Ig
  },
  // {
  //   name: 'youtube',
  //   icon: Yb
  // },
  // {
  //   name: 'tiktok',
  //   icon: Tiktok
  // }
]

type ColumnsProps = {
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  loading: boolean
  handleViewUser: (handleViewUser:InfluencerInCampaign) => void
  allowReviewDeadline?:boolean
};

export const influencersParticipantsColumns = ({
  loading,handleViewUser,allowReviewDeadline
}: ColumnsProps): TableColumnsType<InfluencerInCampaign> => [
    {
      title: 'Name',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {loading
            ? <>
              <Skeleton.Avatar active shape='circle' style={{ width: 30, height: 30 }} />
              <Skeleton.Input active size='small' />
            </>
            : <>
              <img
              onClick={() =>handleViewUser(record)}
                className="w-[30px] h-[30px] rounded-[50%] object-cover"
                src={record?.creator?.avatarUrl || DefaultAvatar}
                alt="avatar"
              />
              {formatName(record?.creator?.name as string)}
            </>}
        </div>
      ),
    },
    {
      title: 'Participants Source',
      render: () => <div>
        {loading ? <Skeleton.Input active size='small' /> : 'Invited'}
      </div>,
    },
    {
      title: 'Instagram',
      render: (_, record) => <div>
        {loading ? <Skeleton.Input active size='small' /> : record?.creator?.instagramUsername}
      </div>,
    },
    {
      title: 'Content Deadline',
      render: (_, record) => <div>
        {loading ? <Skeleton.Input active size='small' /> : <div className='flex flex-col'>
          {record.isFinalDeadline == 1 && record.creatorSuggestedDeadline && (
            <span className='text-sm text-gray-500 line-through'>
              {dayjs(record?.previousDeadline).format(DATE_TIME_FORMAT)}
            </span>
          )}
          <span className='text-sm font-normal text-gray-800'>{dayjs(record.deadline).format(DATE_TIME_FORMAT)}</span>
          {record?.creatorSuggestedDeadline && record?.isFinalDeadline == 0 && (
            <span  className={`text-sm font-normal text-blue-500 ${allowReviewDeadline ? 'block' : 'hidden'}`}>Requested Date</span>
          )}
        </div>}
      </div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => {
        const color = getColorInfluencerContent(status as InfluencerContentStatus);
        return <>
          {loading
            ? <Skeleton.Button active style={{ borderRadius: 50, height: 28, width: 80 }} />
            : <TagColor background={color?.background as string} color={color?.color as string} status={color?.status as InfluencerContentStatus} />}
        </>
      },
    },
  ];

export const genders = ['male', 'female', 'other', 'all']

export const genderFilterOptions = ['male', 'female']

export const ageAudience = [
  {
    label: '18 - 24',
    value: [18, 24]
  },
  {
    label: '25 - 32',
    value: [25, 32]
  },
  {
    label: '33 - 40',
    value: [33, 40]
  },
  {
    label: '41 - 50',
    value: [41, 50]
  },
]
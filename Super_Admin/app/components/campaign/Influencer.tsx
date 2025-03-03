import React, {
  Key,
  useEffect,
  useState,
} from 'react';

import {
  Table,
  TableProps,
  Tabs,
  TabsProps,
} from 'antd';
import {
  brandUpdateInvitationStatus,
  getInfluencerParticipantsInCampaign,
} from '~/apis/campaign';
import { influencersParticipantsColumns } from '~/constants/creator.constant';
import { useAuthContext } from '~/contexts/auth.context';
import {
  Creator,
  InfluencerInCampaign,
} from '~/models/User.model';

import {
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ChevronUpDownIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useParams } from '@remix-run/react';

import { InputSearch } from '../ui/input-search';
import ModalReviewRequestDate from './ModalReviewRequestDate';
import ModalViewInfluencerProfile from './ModalViewInfluencerProfile';

const rowSelection: TableProps<InfluencerInCampaign>['rowSelection'] = {
  onChange: (selectedRowKeys: Key[], selectedRows: InfluencerInCampaign[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const items: TabsProps['items'] = [
  { key: '', label: <div>Applicants</div> },
  { key: 'brand_declined_influencer', label: 'Rejected Applicants' },
];

function Influencer() {
  const { id } = useParams();
  const {hasPermission} = useAuthContext()
  const [tab, setTab] = useState<'' | 'brand_declined_influencer'>('')
  const [influencers, setInfluencers] = useState<InfluencerInCampaign[]>([])
  const [selectedInfluencer, setSelectedInfluencer] = useState<Creator | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [modalReviewDeadline, setModalReviewDeadline] = useState<boolean>(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const allowReviewDeadline = hasPermission('review-content-deadline')

  const handleGetInfluencersInCampaign = async () => {
    setLoading(true)
    await getInfluencerParticipantsInCampaign(tab, id as string, 100, 1)
      .then((res) => setInfluencers(res?.data?.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    handleGetInfluencersInCampaign()
  }, [tab])

  const handleApprove = async (influencerId: string): Promise<void> => {
    await brandUpdateInvitationStatus(id as string, influencerId, true)
      .then(() => {
        handleGetInfluencersInCampaign()
      })
  }

  const handleReject = async (influencerId: string): Promise<void> => {
    await brandUpdateInvitationStatus(id as string, influencerId, false)
      .then(() => {
        handleGetInfluencersInCampaign()
      })
  }

  // Handle row click to open the drawer
  const handleRowClick = (record: Creator) => {
    if (allowReviewDeadline && record.creatorSuggestedDeadline && record.status !== 'joined_campaign' && record.isFinalDeadline !== 1) {
      setSelectedInfluencer(record);
      setModalReviewDeadline(true);
    }
  };

  const handleViewUser = (record: InfluencerInCampaign) => {
    setSelectedUserId(record.creator?.id as string)
  }


  return (
    <div>
      <Tabs defaultActiveKey="" items={items} onChange={(e) => setTab(e as any)} />
      <div className='mt-2 flex items-end justify-between'>
        <div className='flex hidden items-center gap-2'>
          <InputSearch placeholder='Influencer name' className='w-[300px] mt-[1px] h-[36px] ' />
          <button className='bg-[#F3F4F6] px-3 justify-between flex items-center px hover:bg-gray-200 transition-all text-sm h-[36px] w-[105px] font-normal rounded-[9px] text-gray-400'>
            <XCircleIcon className='text-gray-400' width={16} />
            Reject all
          </button>
          <button className='bg-[#F3F4F6] px-3 justify-between flex items-center px hover:bg-gray-200 transition-all text-sm h-[35px] w-[120px] font-normal rounded-[9px] text-gray-400'>
            <CheckCircleIcon className='text-gray-400' width={16} />
            Approve all
          </button>
        </div>
        <div className='flex hidden items-center gap-3'>
          <button className='bg-[#F3F4F6] px-3 justify-between flex items-center px hover:bg-[#D1D5DB] transition-all text-sm h-[35px] w-[123px] font-normal rounded-[9px] text-[#1F2937]'>
            All Status
            <ChevronUpDownIcon width={16} />
          </button>
          <button className='bg-[#F3F4F6] hover:bg-[#D1D5DB] transition-all flex items-center justify-center gap-1 text-sm h-[35px] w-[87px] font-normal rounded-[9px] text-[#1F2937]'>
            <AdjustmentsHorizontalIcon width={16} />  Filter
          </button>
        </div>
      </div>
      {/* Influeners Table */}
      <div className='mt-2 cursor-pointer'>
        <Table<InfluencerInCampaign>
          onRow={(record) => ({
            onClick: () => handleRowClick(record as any),
          })}
          rowSelection={{ type: 'checkbox', ...rowSelection }}
          columns={influencersParticipantsColumns({ handleApprove, handleReject, loading, handleViewUser, allowReviewDeadline })}
          dataSource={
            loading
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any
              : influencers
          }
        />
        {/* Review Review Request Date */}
        <ModalReviewRequestDate
          onRefresh={handleGetInfluencersInCampaign}
          onclose={() => setModalReviewDeadline(false)}
          open={modalReviewDeadline}
          campaignId={id as string}
          influencer={selectedInfluencer as Creator} />

        {/* View User Profile */}
        {selectedUserId !== '' && (
          <ModalViewInfluencerProfile
            id={selectedUserId}
            open={selectedUserId !== ''}
            onClose={() => setSelectedUserId('')} />
        )}
      </div>
    </div>
  )
}

export default Influencer;

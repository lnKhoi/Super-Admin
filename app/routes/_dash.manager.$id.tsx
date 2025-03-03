import 'react-toastify/dist/ReactToastify.css';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  Segmented,
  Skeleton,
} from 'antd';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { getCampaignDetails } from '~/apis/campaign';
import CampaignDetails from '~/components/campaign/CampaignDetails';
import Content from '~/components/campaign/Content';
import Finance from '~/components/campaign/Finance';
import Influencer from '~/components/campaign/Influencer';
import ModalInviteInfluencerToCampaign
  from '~/components/campaign/ModalInviteInfluencerToCampaign';
import Order from '~/components/campaign/Order';
import Reports from '~/components/campaign/Reports';
import ModalSelectTimeRange, {
  DateRange,
} from '~/components/ui/ModalSelectTimeRange';
import { campaignDetailsTabs } from '~/constants/campaign.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { Campaign } from '~/models/Campaign.model';
import { Permission } from '~/models/role.model';
import { abbreviateLastName } from '~/utils/formatNumber';

import {
  PencilSquareIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  Link,
  MetaFunction,
  useNavigate,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Campaign Details' }];
};

type Tab = 'Campaign Details' | 'Influencer' | 'Content' | 'Reports' | 'Order' | 'Finance'
function page() {
  const { id } = useParams();
  const { hasPermission, userInfo } = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [tab, setTab] = useState<Tab>('Campaign Details');
  const [modalInvite, setModalInvite] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState<{ time: string, dateRange: DateRange }>({ time: '7d', dateRange: null })

  const handleGetCampaignDetails = async (): Promise<void> => {
    setLoading(true)
    await getCampaignDetails(id as string)
      .then((res) => setCampaign(res.data))
      .catch((err) => toast.error(err?.message))
      .finally(() => setLoading(false))
  };

  const getCampaignTab = () => {
    switch (tab) {
      case 'Campaign Details':
        return <CampaignDetails loading={loading} campaign={campaign} />;
      case 'Influencer':
        return <Influencer />;
      case 'Content':
        return <Content campaign={campaign} />;
      case 'Reports':
        return <Reports filter={filter} campaign={campaign} />;
      case 'Order':
        return <Order campaign={campaign} />;
      case 'Finance':
        return <Finance />;
      default:
        break;
    }
  };

  const handleFilterReport = (selectedFilter: string, dateRange: DateRange) => {
    setFilter({ time: selectedFilter, dateRange: dateRange })
  }

  useEffect(() => {
    handleGetCampaignDetails();
  }, []);

  useEffect(() => {
    const prevScreen = localStorage.getItem('campaignTab')
    setTab(prevScreen as Tab || 'Campaign Details')
  }, [id])


  useEffect(() => {
    (userInfo && !hasPermission('view-campaign')) && navigate('/page-not-found')
  }, [userInfo])


const filteredTab = useMemo(() => {
  return campaignDetailsTabs.filter(item => 
    !item.permission || userInfo?.permissions.includes(item.permission as Permission) )
},[userInfo])


  return (
    <div>
      <ToastContainer />
      <div className='fixed w-full'>
        <div className='relative h-[60px] items-center -ml-5 border-b border-b-gray-200 bg-white z-40 -mt-5  w-[calc(100%-200px)] px-8 flex  justify-between'>
          <Breadcrumb
            className='w-[200px]'
            items={[
              {
                title: <Link onClick={() => localStorage.removeItem('campaignTab')}
                  to={'/manager/campaigns'}>Campaigns</Link>
              },
              {
                title: <>
                  {loading
                    ? <Skeleton.Button style={{ width: 90 }} size='small' active />
                    : <p className='text-gray-800'>{abbreviateLastName(campaign?.name as string, 13)}</p>
                  }
                </>
              },
            ]}
          />
          <div className='flex items-center gap-3'>
            {hasPermission('edit-campaign') && (
              <Button
                onClick={() => navigate(`/manager/edit/${campaign?.id}`)}
                disabled={campaign?.joinedCreators?.length as number > 0}
                className='bg-gray-100 text-sm font-semibold hover:bg-gray-100 border-none' >
                <PencilSquareIcon className='w-5 h-5 text-gray-800' />
                Edit Campaign
              </Button>
            )}

            {hasPermission('invite-imported-influencers') && (
              <Button
                onClick={() => setModalInvite(true)}
                className='bg-gray-100 hover:bg-gray-400 tesm font-semibold border-gray-100'
                type='text'
              >
                <UserPlusIcon className='bg-gray-100 text-gray-800 font-bold w-5 h-5' />
                Invite Influencer
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='mt-14'>
        <div className='flex '>
          <Segmented
            className='fixed z-50'
            defaultValue={tab}
            value={tab}
            style={{ marginBottom: 8 }}
            onChange={(value) => { setTab(value as Tab); localStorage.setItem('campaignTab', value) }}
            options={filteredTab}
          />
          {/* <ModalSelectTimeRange/> */}
          {tab === 'Reports' && (
            <div className='fixed z-50 top-[78px] right-[32px]'>
              <ModalSelectTimeRange onSelect={(time, dates) => handleFilterReport(time, dates)} />
            </div>
          )}
        </div>
        <div className='pt-14'>{getCampaignTab()}</div>
      </div>

      {/* Modal Invite Influencer */}
      <ModalInviteInfluencerToCampaign open={modalInvite} onClose={() => setModalInvite(false)} campaignId={id as string} />
    </div>
  );
}

export default page;

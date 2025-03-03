import 'react-toastify/dist/ReactToastify.css';

import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Button as AntButton,
} from 'antd';
import debounce from 'lodash/debounce';
import {
  toast,
  ToastContainer,
} from 'react-toastify';
import { getCampaigns } from '~/apis/campaign';
import NoCampaigns from '~/assets/no-campaign.png';
import CampaignCard from '~/components/campaign/campaignCard';
import ReviewCard from '~/components/custom/skeletons/CampaignCard';
import { InputSearch } from '~/components/ui/input-search';
import { useAuthContext } from '~/contexts/auth.context';
import { Campaign } from '~/models/Campaign.model';

import {
  AdjustmentsHorizontalIcon,
  ChevronUpDownIcon,
  CloudArrowDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  Link,
  MetaFunction,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Campaigns' }]
}

function Campaigns() {
  const { hasPermission } = useAuthContext()
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<'get-list' | 'load-more' | ''>('')
  const [campaigns, setCampagins] = useState<Campaign[]>([])
  const [limit, setLimit] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)

  const handleGetCampaigns = async (hasMore?: boolean): Promise<void> => {

    hasMore ? setLoading('load-more') : setLoading('get-list')
    const nextLimit = hasMore ? limit + 20 : limit

    await getCampaigns(nextLimit, 1, search)
      .then(res => {
        setTotal(res.data.total)
        setCampagins(res?.data?.data)
        hasMore && setLimit(nextLimit)
      })
      .catch(err => toast.error(err?.message))
      .finally(() => setLoading(''))
  }

  useEffect(() => {
    handleGetCampaigns()
  }, [search])

  const handleReloadCampagins = (): void => {
    handleGetCampaigns()
  }

  const handleSearchCampaigns = debounce(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setSearch(e.target.value);
    }, 500);

  const noMore = total === campaigns.length

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [])

  return (
    <div>
      <ToastContainer />
      <div className='flex items-end justify-between'>
        <div className='flex flex-col'>
          <h2 className='text-2xl text-gray-900'>Campaigns</h2>
          <p className='text-sm text-gray-500 mt-1'>Manage your campaigns and view their sales performance.</p>
        </div>
        {hasPermission('create-campaign') && (
          <Link to='/manager/campaign/add-campaign'>
            <Button icon={<PlusIcon className='w-5 h-5 text-white' />} type='primary'>
              Add Campaign
            </Button>
          </Link>
        )}
      </div>
      <div className='mt-5 flex items-end justify-between'>
        <InputSearch onChange={(e) => handleSearchCampaigns(e)} placeholder='Campaign name' className='w-[300px] h-[36px] ' />
        <div className='flex hidden items-center gap-3'>
          <button className='bg-[#F3F4F6] px-3 justify-between flex items-center px hover:bg-[#D1D5DB] transition-all text-sm h-[36px] w-[105px] font-normal rounded-[9px] text-[#1F2937]'>
            All Status
            <ChevronUpDownIcon width={16} />
          </button>
          <button className='bg-[#F3F4F6] hover:bg-[#D1D5DB] transition-all flex items-center justify-center gap-1 text-sm h-[36px] w-[87px] font-normal rounded-[9px] text-[#1F2937]'>
            <AdjustmentsHorizontalIcon width={16} />  Filter
          </button>
          <button className='bg-[#F3F4F6] hover:bg-[#D1D5DB] transition-all flex items-center justify-center gap-1 text-sm h-[36px] w-[87px] font-normal rounded-[9px] text-[#1F2937]'>
            <CloudArrowDownIcon width={16} />  Export
          </button>
        </div>
      </div>

      {loading === 'get-list'
        ? <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-5 mt-5'>
          {Array?.from({ length: 16 }).map((s, idx) => <ReviewCard key={idx} />)}
        </div>
        : <div>
          {campaigns?.length === 0 && (
            <div className='flex items-center flex-col gap-3 justify-center w-full h-[calc(100vh-200px)]'>
              <img src={NoCampaigns} className='w-[370px]' />
              {hasPermission('create-campaign') && (
                <Link to='/manager/campaign/add-campaign'>
                  <Button className='h-[36px]' ><PlusIcon width={20} /> Add Campaign</Button>
                </Link>
              )}
            </div>
          )}
          <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-5 mt-5'>
            {hasPermission('view-campaign') && campaigns?.map((c) => (
              <CampaignCard onReload={handleReloadCampagins} key={c.id} campaign={c} />
            ))}
          </div>

          {!noMore && hasPermission('view-campaign') && (
            <AntButton
              disabled={noMore}
              loading={loading == 'load-more'}
              onClick={() => handleGetCampaigns(true)}
              className='mx-auto mt-[44px] flex justify-center' >
              Load more...
            </AntButton>
          )}
        </div>
      }
    </div>
  )
}

export default Campaigns

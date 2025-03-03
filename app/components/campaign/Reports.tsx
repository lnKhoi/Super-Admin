import React, {
  useEffect,
  useState,
} from 'react';

import {
  Skeleton,
  Table,
} from 'antd';
import CountUp from 'react-countup';
import { getInstagramStatistics } from '~/apis/campaign';
import {
  getCampaignConversionRate,
  getCampaignROI,
  getClickThroughRateInReport,
  getCostPerClicks,
  getCostPerConversion,
  getCpaInReport,
  getInfluencerInReport,
} from '~/apis/reports';
import {
  influencerPerformanceColumns,
  initialReport,
} from '~/constants/report.constant';
import { Campaign } from '~/models/Campaign.model';
import { ReportCampaign } from '~/models/report.model';
import { InfluencerPerformance } from '~/models/User.model';

import { useParams } from '@remix-run/react';

import LineChart from '../custom/charts/LineChart';
import InfluencerProfile from '../profile/InfluencerProfile';
import { DateRange } from '../ui/ModalSelectTimeRange';

type ReportsProps = {
  campaign: Campaign | null
  filter: { time: string, dateRange: DateRange }
}

function Reports({ campaign, filter }: ReportsProps) {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false)
  const [reportData, setReportData] = useState<ReportCampaign>(initialReport)

  const [modal, setModal] = useState<boolean>(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerPerformance | null>(null)

  const handleViewInfluencerProfile = (influencer: InfluencerPerformance) => {
    setModal(!modal)
    setSelectedInfluencer(influencer)
  }

  const handleGetIGReport = async () => {
    setLoading(true)
    const [igStats, roi, conversionRate, costPerConversion, costperClicks, influencers, ctr, cpa] = await Promise.all([
      getInstagramStatistics(id as string, filter),
      getCampaignROI(id as string, filter),
      getCampaignConversionRate(id as string, filter),
      getCostPerConversion(id as string, filter),
      getCostPerClicks(id as string, filter),
      getInfluencerInReport(id as string, filter),
      getClickThroughRateInReport(id as string, filter),
      getCpaInReport(id as string, filter)

    ]).finally(() => setLoading(false))

    setReportData({
      ...reportData,
      roi: roi?.data?.roi,
      totalClicks: conversionRate?.data?.totalClicks,
      conversionRate: conversionRate?.data?.conversionRate,
      totalImpressions: igStats?.data?.totalImpressions,
      engagementRate: igStats?.data?.engagementRate,
      totalRevenue: roi.data?.totalRevenue,
      costPerConversion: costPerConversion?.data?.costPerConversion,
      costPerClicks: costperClicks?.data?.costPerClick,
      influencers: influencers?.data?.data,
      totalCost: roi?.data?.totalCost,
      totalCtr: ctr?.data?.crt,
      cpa: cpa?.data?.costPerAcquisition,
      totalPurchases: conversionRate?.data?.buyCount
    })
  };

  useEffect(() => {
    if (filter?.time !== 'custom' || (filter?.dateRange?.[0] && filter?.time === 'custom')) {
      handleGetIGReport()
    }
  }, [filter.time, filter.dateRange])

  return (
    <div className='w-full'>
      <div className='mb-6 px-4 py-4 border border-gray-200 rounded-xl'>
        <div className='flex items-center gap-4'>
          <div className='p-4 rounded-xl bg-gray-100 w-[220px] h-[135px]'>
            <h6 className='text-2xl font-semibold'>Revenue</h6>
            <p className='text-xs text-gray-500 mt-2'>Total</p>
            {loading
              ? <Skeleton.Button className='mt-2' active block />
              : <p className='font-semibold text-[30px] text-gray-800 mt-2'>$
                <CountUp decimals={reportData?.totalRevenue === 0 ? 0 : 2} end={reportData?.totalRevenue} />
              </p>
            }
          </div>
          <div className='p-4 rounded-xl bg-gray-100 w-[220px] h-[135px]'>
            <h6 className='text-2xl font-semibold'>Cost</h6>
            <p className='text-xs text-gray-500 mt-2'>Total campaign budget</p>
            {loading
              ? <Skeleton.Button className='mt-2' active block />
              : <p className='font-semibold text-[30px] text-gray-800 mt-2'>$
                <CountUp end={reportData.totalCost as number} decimals={2} />
              </p>
            }
          </div>
        </div>
        <div className='mt-5'>
          <LineChart />
        </div>
      </div>
      <div className='grid xl:grid-cols-8 grid-cols-4 gap-4'>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Engagement Rate</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp decimals={2} end={reportData?.engagementRate || 0} />%
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Total Clicks</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp end={reportData?.totalClicks} />
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Total Purchases</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp end={reportData.totalPurchases} />
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Click Through Rate (CTR)</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp decimals={2} end={reportData.totalCtr as number} />%
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Conversion Rate</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp decimals={reportData?.conversionRate == 0 ? 0 : 1} end={reportData?.conversionRate} />%
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>ROI</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              <CountUp decimals={reportData?.roi === 0 ? 0 : 1} end={reportData?.roi} />%
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Cost Per Accquisition (CPA)</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              $<CountUp end={reportData?.cpa} decimals={2} />
            </span>
          }
        </div>
        <div className='border justify-around border-gray-200 hover:shadow-md cursor-pointer transition-shadow 2xl:p-5 p-4 rounded-2xl flex items-start flex-col h-[109px]'>
          <h5 className=' text-gray-800 text-xs'>Cost Per Click (CPC)</h5>
          {loading
            ? <Skeleton.Button active block />
            : <span className='text-2xl font-bold'>
              $<CountUp end={reportData?.costPerClicks} decimals={2} />
            </span>
          }
        </div>
      </div>
      {/* Influencer Performance */}
      <h2 className='mt-6 text-2xl font-medium text-gray-800'>Influencer Performance</h2>
      <p className='text-sm mt-1 text-gray-700'>Manage your content and view their sales performance.</p>
      <div className='mt-6 cursor-pointer'>
        <Table
          onRow={(record) => ({
            onClick: () => handleViewInfluencerProfile(record as any),
          })}
          columns={influencerPerformanceColumns({ loading })}
          dataSource={
            loading
              ? [1, 2, 3] as any
              : reportData?.influencers
          } />
      </div>

      {modal && (
        <InfluencerProfile
          campaignId={id as string}
          inluencerId={selectedInfluencer?.creator?.id as string}
          onClose={() => setModal(false)}
          open={modal} />
      )}
    </div>
  )
}

export default Reports

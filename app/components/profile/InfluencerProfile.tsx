import React, {
  useEffect,
  useState,
} from 'react';

import {
  Avatar,
  Modal,
} from 'antd';
import {
  getIGAudienceOfInfluencer,
  getRevenueOfInfluencer,
} from '~/apis/reports';
import { initialInfluencerOverLifeTime } from '~/constants/report.constant';
import { InfluencerInReport } from '~/models/report.model';

type InfluencerProfileProps = {
    open: boolean,
    onClose: () => void
    campaignId: string
    inluencerId: string
}

function InfluencerProfile({ open, onClose, campaignId, inluencerId }: InfluencerProfileProps) {

    const [report, setReport] = useState<InfluencerInReport>(initialInfluencerOverLifeTime)

    const handleGetIGReport = async () => {
        const [influencerAudience, revenue] = await Promise.all([
            getIGAudienceOfInfluencer(campaignId, inluencerId),
            getRevenueOfInfluencer(inluencerId)
        ]);

        setReport({
            ...report,
            conversionRate: revenue?.data?.conversionRate,
            totalClicks: revenue?.data?.totalClicks,
            creator: influencerAudience?.data,
            revenue: revenue?.data?.totalRevenue,
            costPerClick: revenue?.data?.costPerClick,
            totalPurchases: revenue?.data?.orderCount
        })
    };

    useEffect(() => {
        handleGetIGReport()
    }, [])

    return (
        <Modal footer={null} width={650} open={open} onCancel={() => onClose()}>
            <div className='flex items-center gap-5'>
                <Avatar src={report?.creator?.creator?.avatarUrl} className='w-[128px] h-[128px] rounded-[50%]' />
                <div className='flex flex-col'>
                    <p className='text-2xl font-semibold'>{report?.creator?.creator?.name}</p>
                    <span className='text-sm mt-[2px] font-normal text-gray-500'>{report?.creator?.creator?.email}</span>
                </div>
            </div>
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <p className='text-lg font-semibold'>Influencer Performance Over Lifetime</p>
                </div>
            </div>
            <div className='mt-5 grid grid-cols-3 gap-5'>
                <div className='rounded-2xl bg-gray-100 h-[93px] p-4'>
                    <p className='text-2xl font-semibold'>${report?.revenue}</p>
                    <p className='mt-3 text-gray-500 text-sm font-medium'>Revenue</p>
                </div>
                <div className='rounded-2xl bg-gray-100 h-[93px] p-4'>
                    <p className='text-2xl font-semibold'>{report.totalClicks}</p>
                    <p className='mt-3 text-gray-500 text-sm font-medium'>Click</p>
                </div>
                <div className='rounded-2xl bg-gray-100 h-[93px] p-4'>
                    <p className='text-2xl font-semibold'>${report?.costPerClick?.toFixed(2)}</p>
                    <p className='mt-3 text-gray-500 text-sm font-medium'>CPC (Cost Per Click)</p>
                </div>
                <div className='rounded-2xl bg-gray-100 h-[93px] p-4'>
                    <p className='text-2xl font-semibold'>{report?.totalPurchases}</p>
                    <p className='mt-3 text-gray-500 text-sm font-medium'>Purchases</p>
                </div>
                <div className='rounded-2xl bg-gray-100 h-[93px] p-4'>
                    <p className='text-2xl font-semibold'>{report?.conversionRate?.toFixed(2)}%</p>
                    <p className='mt-3 text-gray-500 text-sm font-medium'>Conversion Rate</p>
                </div>
            </div>
        </Modal>
    )
}

export default InfluencerProfile

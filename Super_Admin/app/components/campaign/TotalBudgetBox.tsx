import React from 'react';

import { Tooltip } from 'antd';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type TotalBudgetBoxProps = {
    perInfluencerBudget:number,
    maximumParticipants:number
}

function TotalBudgetBox({maximumParticipants,perInfluencerBudget}:TotalBudgetBoxProps) {

    const totalInfluencerBudget = maximumParticipants * perInfluencerBudget
    const totalCommissionFee = totalInfluencerBudget * 0.15
    const totalBudget = totalCommissionFee + totalInfluencerBudget

    return (
        <div className='w-[350px]  h-[435px] shadow-lg p-4 justify-center flex flex-col items-center rounded-2xl border-b-[4px] border-b-blue-500'>
            <h2 className='text-lg font-semibold text-gray-800'>Total Campaign Budget</h2>
            <span className='text-gray-500 text-sm'>Influencer Budget + Commission Fee</span>
            <span className='text-3xl font-medium mt-1'>{(totalBudget || 0).toFixed(2)} Token</span>
            <div className='mt-8 w-full gap-2 flex flex-col'>
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-gray-800'>Influencer Budget</p>
                    <span className='text-sm font-medium text-gray-800'>{(totalInfluencerBudget || 0)?.toFixed(2)} Token</span>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-gray-800'>Maximum Participants</p>
                    <span className='text-sm font-medium text-gray-800'>{maximumParticipants || 0}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='text-sm  text-gray-800'>Per-influencer Budget</p>
                    <span className='text-sm font-medium text-gray-800'>{perInfluencerBudget?.toFixed(2) || '0.00'} Token</span>
                </div>
                <span className='w-full bg-gray-200 my-2 h-[1px]'></span>
                <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-gray-800 flex gap-2'>Commission Fee (15%)
                    <Tooltip placement='topLeft' title='The commision fee is calculated as 15% of the Influencer Budget. This fee compenstates the influencer for their work in promoting your campaign '>
                        <ExclamationCircleIcon className='w-5 h-5 cursor-pointer text-gray-500' />
                    </Tooltip>
                    </p>
                    <span className='text-sm font-medium text-gray-800'>{(totalCommissionFee || 0)?.toFixed(2)} Token</span>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-gray-800'>Total</p>
                    <span className='text-sm font-medium text-gray-800'>
                        {(totalBudget || 0).toFixed(2)} Token
                    </span>
                </div>
                <span className='w-full bg-gray-200 my-2 h-[1px]'></span>
                <div className='text-sm text-gray-500 text-center w-full p-0'>
                    Ensure your input the correct influencer budget to get accurate calculations.<br />For support, contact us at support@spiral.com
                </div>
            </div>
        </div>
    )
}

export default TotalBudgetBox

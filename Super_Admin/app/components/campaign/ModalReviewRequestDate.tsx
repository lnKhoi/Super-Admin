import React, { useState } from 'react';

import {
  Button,
  DatePicker,
  message,
  Modal,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  approveDeadlineFromInfluencer,
  requestNewDeadlineForInfluencer,
} from '~/apis/content';
import Avatar from '~/assets/avatar.jpeg';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { Creator } from '~/models/User.model';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

type ModalReviewRequestDateProps = {
  open: boolean
  onclose: () => void
  influencer: Creator
  onRefresh: () => void
  campaignId: string
}

function ModalReviewRequestDate({ onclose, open, influencer, campaignId, onRefresh }: ModalReviewRequestDateProps) {
  const [modalType, setModalType] = useState<'confirm-approve' | 'final-deadline' | ''>('')
  const [loadingType, setLoadingType] = useState<'request-new-deadline' | 'approve-deadline' | ''>('')
  const [date, setDate] = useState<null | Dayjs>(null)

  const [messageApi, contextHolder] = message.useMessage();

  const handleApproveDeadline = () => {
    setLoadingType('approve-deadline')
    approveDeadlineFromInfluencer(campaignId, influencer?.creator?.id as string)
      .then(() => {
        message.success('Approve content deadline successfully!')
        setModalType('')
        onRefresh()
        onclose()
      })
      .catch(err => messageApi.error(err?.message))
      .finally(() => setLoadingType(''))
  }


  const handleRequestNewDeadline = () => {
    setLoadingType('request-new-deadline')
    requestNewDeadlineForInfluencer(campaignId, influencer?.creator?.id as string, dayjs(date).toISOString())
      .then(res => {
        messageApi.success('Successfully, the New Deadline has been sent to the influencer!')
        setDate(null)
        setModalType('')
        onRefresh()
        onclose()
      })
      .finally(() => setLoadingType(''))
      .catch(err => messageApi.error(err?.message))
  }


  return (
    <>
      {contextHolder}
      <Modal
        width={650}
        title={<div className='text-center text-xl font-semibold'>Request Date</div>}
        open={open}
        footer={
          <div className='flex items-center justify-between'>
            <Button onClick={() => setModalType('final-deadline')} className='bg-red-500 text-white'>Decline</Button>
            <div className='flex items-center gap-3'>
              <Button onClick={onclose}>Cancel</Button>
              <Button onClick={() => setModalType('confirm-approve')} type='primary'>Approve</Button>
            </div>
          </div>
        }
        onCancel={onclose}>
        <div className='mt-8'>
          {/* User info + deadline */}
          <div className='flex items-center justify-between h-[72px] rounded-xl p-4 border border-gray-100'>
            <div className='flex gap-3 items-center'>
              <img src={influencer?.avatarUrl || Avatar} alt="avatar" className='w-[36px] h-[36px] object-cover rounded-[50%]' />
              <span className='text-sm font-medium text-gray-800'>{influencer?.creator?.name}</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-normal text-gray-500'>Content Deadline</span>
              <span className='text-sm font-normal text-gray-800'>
                {dayjs(influencer?.deadline).format(DATE_TIME_FORMAT)}
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div className='mt-4 h-[56px] flex items-center gap-3 bg-blue-100 rounded-xl p-4'>
            <ExclamationCircleIcon className='w-5 h-5 text-gray-800' />
            <span className='font-normal text-sm text-gray-800'>
              Influencer request date their deadline to
              <span className='font-semibold text-sm text-blue-500 ml-1'>
                {dayjs(influencer?.creatorSuggestedDeadline).format(DATE_TIME_FORMAT)}
              </span>
            </span>
          </div>

          <div className='w-full h-[1px] my-[28px] bg-gray-200'></div>
          <span className='text-sm font-bold mb-2 text-gray-800'>Reason</span>
          <p className='text-sm mb-6 font-normal text-gray-500'>{influencer?.reason}</p>
        </div>


      </Modal>
      {/* Final Deadline Request */}
      <Modal
        width={356}
        height={306}
        footer={null}
        onCancel={() => setModalType('')}
        open={modalType == 'final-deadline'}>
        <p className='text-xl font-semibold text-gray-800 text-center'>Final Deadline Request</p>
        <p className='text-gray-500 text-sm font-normal mt-1 text-center w-[290px]'>Request the final content deadline. If the influencer does not agree, they will be removed from the campaign.</p>
        <div className='mt-8 flex flex-col w-full'>
          <span className='text-sm mb-2 font-medium text-gray-500'>Content Deadline</span>
          <DatePicker
            format={DATE_TIME_FORMAT}
            onChange={(d) => setDate(d)}
            minDate={dayjs().add(14, 'day')}
            className='bg-gray-100 border-gray-50 hover:bg-gray-100' />
        </div>
        <div className='mt-8 flex items-center gap-3'>
          <Button onClick={() => setModalType('')} className='w-[148px]'>Cancel</Button>
          <Button loading={loadingType === 'request-new-deadline'} disabled={!date} onClick={handleRequestNewDeadline} className='w-[148px]' type='primary'>Confirm</Button>
        </div>
      </Modal>

      {/* Modal Confirm Approve */}
      <Modal
        width={356}
        height={254}
        footer={null}
        open={modalType == 'confirm-approve'}
        onCancel={() => setModalType('')}
      >
        <div className='flex flex-col items-center justify-center'>
          <div className='w-[44px] h-[44px] flex items-center justify-center bg-blue-100 rounded-[50%]'>
            <CheckCircleIcon className='w-6 h-6 text-blue-500' />
          </div>
          <span className='text-xl mt-5 font-semibold text-gray-800'>Approve Deadline Request</span>
          <span className='text-sm font-normal w-[286px] text-center text-gray-500 mt-1'>Are you sure you want to approve this deadline request?</span>
          <div className='mt-8 flex items-center gap-3'>
            <Button onClick={() => setModalType('')} className='w-[148px]'>No</Button>
            <Button loading={loadingType === 'approve-deadline'} onClick={handleApproveDeadline} className='w-[148px]' type='primary'>Yes</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalReviewRequestDate

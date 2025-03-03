import React from 'react';

import {
  Button,
  message,
} from 'antd';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';
import DefaultAvatar from '~/assets/avatar.jpeg';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import {
  ContentStatus,
  getColorStatusContent,
} from '~/helpers/campaign.helper';
import { Content } from '~/models/Content.model';
import {
  abbreviateLastName,
  formatName,
} from '~/utils/formatNumber';

import { LinkIcon } from '@heroicons/react/24/outline';
import { Link } from '@remix-run/react';

import ContentCardSkeleton from '../custom/skeletons/ContentCardSkeleton';

type ContentCardProps = {
    content: Content
    loading: boolean
}

function ContentCard({ content, loading }: ContentCardProps) {
    const [messageApi, contextHolder] = message.useMessage();

    const videoExtensions = ['mov', 'mp4'];
    const isVideo = content?.urls?.[0] ? videoExtensions?.includes(content?.urls[0]?.slice(-3)) : false;



    return (
        <div className='rounded-2xl cursor-pointer border border-gray-200 hover:shadow-md transition-shadow'>
            {
                loading
                    ? <ContentCardSkeleton />
                    : <>
                        {contextHolder}
                        {isVideo
                            ? <video
                                autoPlay
                                loop
                                muted className='2xl:h-[290px] xl:h-[280px] lg:h-[240px] rounded-t-2xl w-full object-cover' src={content?.urls?.[0]}></video>
                            : <img className='2xl:h-[290px] xl:h-[280px] lg:h-[240px] rounded-t-2xl w-full object-cover'
                                src={content?.urls?.[0]} alt="content preview" />
                        }
                        <div className={`pt-4 px-4 pb-2 flex flex-col justify-around ${content?.approved === 'posted' ? 'h-[300px]' : 'h-[230px]'}`}>
                            <div className='flex items-center gap-3'>

                                <img className='w-[36px] rounded-[50%] h-[36px] object-cover'
                                    src={content?.creator?.avatarUrl || DefaultAvatar} alt="avatar" />
                                <div className='flex flex-col'>
                                    <h6 className='text-sm text-gray-800'>
                                        {formatName(content?.creator?.name as string)}
                                    </h6>
                                    <p className='text-sm text-gray-500 '>{content?.creator?.email}</p>
                                </div>
                            </div>
                            <p className='text-gray-500 mt-2 text-sm leading-5 text-ellipsis text-wrap overflow-hidden '>
                                {abbreviateLastName(content?.caption, 200)}
                            </p>
                            <div className='h-[28px] rounded-lg bg-blue-100 text-xs text-blue-700 w-[158px]  items-center justify-center flex'>
                                {content?.approved == 'posted' ? 'Posting' : 'Create'} date: {dayjs(content?.createdAt)?.format(DATE_TIME_FORMAT)}
                            </div>
                            {content?.approved === 'posted' && (
                                <div className='flex items-center justify-between gap-2 mt-2 mb-4'>
                                    <div className='w-1/2 p-3 h-[80px] flex flex-col justify-between rounded-xl bg-gray-100'>
                                        <p className='text-sm text-gray-500 font-medium'>Conversion Rate</p>
                                        <p className='mt-2 text-gray-800 font-semibold text-[18px]'>{content?.conversionRate?.toFixed(2)} %</p>
                                    </div>
                                    <div className='w-1/2 p-3 h-[80px] rounded-xl bg-gray-100'>
                                        <p className='text-sm text-gray-500 font-medium'>Engagement Rate</p>
                                        <p className='mt-2 text-gray-800 font-semibold text-[18px]'>{content?.engagementRate?.toFixed(2)} %</p>
                                    </div>
                                </div>
                            )}
                            <div className='flex items-center justify-between'>
                                <div style={{ backgroundColor: getColorStatusContent(content?.approved as ContentStatus)?.background }}
                                    className={`inline-flex items-center px-4   gap-1 rounded-[50px] h-[28px]`}>
                                    <div style={{ backgroundColor: getColorStatusContent(content?.approved as ContentStatus)?.color }}
                                        className={`w-2 h-2 rounded-[50%]`}></div>
                                    <span style={{ color: getColorStatusContent(content?.approved as ContentStatus)?.color }} className='text-[12px] capitalize '>
                                        {getColorStatusContent(content?.approved as ContentStatus)?.status}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <CopyToClipboard
                                        onCopy={() => messageApi.success('Copied to clipboard!')}
                                        text={content?.trackingUrl || ''}
                                    >
                                        <div className='h-[30px] w-[30px] cursor-pointer rounded-md bg-gray-200 flex items-center justify-center'>
                                            <LinkIcon width={16} className='text-gray-500' />
                                        </div>
                                    </CopyToClipboard>

                                    <Link to={`/manager/content/${content?.id}`}>
                                        <Button className='bg-gray-100' type='text' >View content</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
            }

        </div>
    )
}

export default ContentCard

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Drawer,
  Skeleton,
} from 'antd';
import { HeartIcon } from 'lucide-react';
import { getInfluencerDetails } from '~/apis/creator';
import { getInfluencerMetric } from '~/apis/reports';
import instagramIcon from '~/assets/insta.svg';
import Avatar from '~/assets/user-avatar.png';
import PieChart from '~/components/custom/charts/Piechart';
import { socials } from '~/constants/creator.constant';
import { Metrics } from '~/models/report.model';
import { Creator } from '~/models/User.model';
import { formatName } from '~/utils/formatNumber';

import {
  ChatBubbleOvalLeftIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type ModalViewInfluencerProfileProps = {
    open: boolean
    onClose: () => void
    id?: string
}

function ModalViewInfluencerProfile({ onClose, open, id }: ModalViewInfluencerProfileProps) {
    const [influencer, setInfluencer] = useState<Creator | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [metrics, setMetrics] = useState<Metrics | null>(null)

    const handleFetchData = () => {
        setLoading(true);
        Promise.all([
            getInfluencerDetails(id as string),
            getInfluencerMetric(id as string),
        ])
            .then(([detailsResponse, metricsResponse]) => {
                setInfluencer(detailsResponse.data);
                setMetrics(metricsResponse?.data)
            })

            .finally(() => setLoading(false));
    };

    useEffect(() => { handleFetchData() }, [id]);

    const pieData = influencer?.demographicGenders?.map(gender => {
        return { name: gender?.detail, y: gender?.valuePercentage, }
    })


    return (
        <Drawer
            placement="right"
            width={992}
            headerStyle={{ display: 'none' }}
            bodyStyle={{ padding: 0, margin: 0, height: '100vh', overflowY: 'scroll' }}
            contentWrapperStyle={{ paddingTop: 0 }}
            onClose={() => onClose()}
            open={open}
        >

            <div className='w-full min-h-screen flex-1'>
                <div className="bg-gradient-to-r from-rose-100 via-rose-100/60 to-teal-100 h-[114px] relative">
                    <div onClick={() => onClose()} className='w-[28px] h-[28px] absolute cursor-pointer left-5 top-4 border rounded-lg flex items-center justify-center'>
                        <XMarkIcon className='w-5 h-5 text-gray-800' />
                    </div>
                </div>
                <div className="min-h-screen  -mt-[54px] ">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r mx-auto  z-30 rounded-xl px-6">
                        <div className="flex items-center gap-5">
                            {loading
                                ? <Skeleton.Avatar active shape='circle' style={{ height: 108, width: 108 }} />
                                : <img
                                    src={influencer?.avatarUrl || Avatar}
                                    alt="Profile"
                                    className="w-[108px] transform translate-y-0.5 h-[108px] rounded-full object-cover"
                                />
                            }
                            <div className='transform translate-y-8'>
                                <h1 className="text-2xl font-semibold">Welcome,{' '}
                                    {loading
                                        ? <Skeleton.Input active size={'small'} />
                                        : formatName(influencer?.name as string)}
                                </h1>
                            </div>
                            <div className="ml-auto pr-1 mt-12 flex items-center space-x-2">
                                <Button onClick={handleFetchData}>Refresh</Button>
                                {/* {influencer?.connectedSocialMedias?.map(social => (
                                    <img key={social} src={'instagramIcon'} alt={social} />
                                ))} */}
                                <img src={instagramIcon} alt="instagram" />
                            </div>
                        </div>

                        {/* Biographic and Expertise Section */}
                        <div className="grid grid-cols-2 gap-6 mt-12">
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Biographic</h2>
                                {loading
                                    ? <Skeleton.Input active size={'small'} />
                                    : <>
                                        {influencer?.biography && (
                                            <div className="text-gray-500 py-2 text-xs rounded-lg bg-gray-100 text-justify px-3 ">
                                                {influencer?.biography}
                                            </div>
                                        )}</>
                                }
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Expertise</h2>
                                <div className="flex flex-wrap gap-2">

                                    {loading
                                        ? <Skeleton.Input active size={'small'} />
                                        : <>
                                            {influencer?.category?.map((item) => (
                                                <span
                                                    key={item}
                                                    className="bg-gray-100 text-sm px-3 py-1 rounded-md"
                                                >
                                                    {item}
                                                </span>
                                            ))}</>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Social Media Stats */}
                        <h2 className="text-lg font-semibold mt-10">Social Media</h2>
                        <div className="grid grid-cols-3 gap-4 mt-5">
                            {socials.map((platform) => (
                                <div
                                    key={platform.name}
                                    className="bg-gray-100 p-6 h-[188px] rounded-lg shadow flex flex-col gap-4 items-start"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className='flex items-center justify-center w-8 h-8 rounded-lg shadow-md bg-white'>
                                            <img src={platform.icon} alt="" />
                                        </div>
                                        <p className='text-xs text-gray-800 capitalize'>{platform.name}</p>
                                    </div>
                                    <div className='items-start grid grid-cols-2  w-full gap-3'>
                                        <div className='flex flex-col items-start'>
                                            <p className="text-gray-800 text-sm font-semibold">
                                                {loading ? <Skeleton.Button active size={'small'} /> : influencer?.instagramFollowersNumber || '---'}
                                            </p>
                                            <span className='text-xs font-normal text-gray-500'>Followers</span>
                                        </div>
                                        <div className='flex flex-col items-start'>
                                            <p className="text-gray-800 text-sm font-semibold">
                                                {loading ? <Skeleton.Button active size={'small'} /> : influencer?.instagramMediaCount || '---'}
                                            </p>
                                            <span className='text-xs font-normal text-gray-500'>Posts</span>
                                        </div>
                                        <div className='flex flex-col items-start'>
                                            <p className="text-gray-800 text-sm font-semibold">
                                                {loading ? <Skeleton.Button active size={'small'} /> : metrics?.engagementRate || '---'}
                                            </p>
                                            <span className='text-xs font-normal text-gray-500'>Engagement rate</span>
                                        </div>
                                        <div className='flex flex-col items-start'>
                                            <p className="text-gray-800 text-sm font-semibold">
                                                {loading ? <Skeleton.Button active size={'small'} /> : influencer?.instagramMediaCount || '---'}
                                            </p>
                                            <span className='text-xs font-normal text-gray-500'>Likes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Performance Over Life */}
                        <h2 className="text-lg font-semibold mt-10">Performance Over Lifetime</h2>
                        <div className='h-[113px] grid mt-3 gap-4 grid-cols-6'>
                            {loading
                                ? [1, 2, 3, 4, 5, 6].map(s => <Skeleton.Node style={{ width: '100%' }} key={s} active className='w-full' />)
                                : <>
                                    <div className='p-4 bg-gray-100 rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>{metrics?.engagementRate.toFixed(2)} %</p>
                                        <span className='text-gray-500 font-medium text-sm'>Engagement rate</span>
                                    </div>
                                    <div className='p-4 bg-gray-100 rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>${metrics?.totalRevenue?.toFixed(2)}</p>
                                        <span className='text-gray-500 font-medium text-sm'>Revenue</span>
                                    </div>
                                    <div className='p-4 bg-gray-100 rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>{metrics?.totalClicks}</p>
                                        <span className='text-gray-500 font-medium text-sm'>Clicks</span>
                                    </div>
                                    <div className='p-4 bg-gray-100  rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>${metrics?.costPerClick.toFixed(2)}</p>
                                        <span className='text-gray-500 font-medium text-sm'>CPC (Cost Per Click)</span>
                                    </div>
                                    <div className='p-4 bg-gray-100  rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>{metrics?.orderCount}</p>
                                        <span className='text-gray-500 font-medium text-sm'>Purchases</span>
                                    </div>
                                    <div className='p-4 bg-gray-100  rounded-xl flex flex-col gap-3'>
                                        <p className='text-2xl font-bold text-gray-800'>{metrics?.conversionRate?.toFixed(2)}%</p>
                                        <span className='text-gray-500 font-medium text-sm'>Conversion Rate</span>
                                    </div>
                                </>
                            }

                        </div>

                        {/* Audience Demographics */}
                        <h2 className="text-lg font-semibold mt-10">Audience Demographic</h2>
                        <div className="grid grid-cols-3 gap-8 mt-5">
                            {/* Age Range */}
                            <div>
                                <h3 className="text-sm text-gray-800 font-medium  mb-4">Age Range</h3>
                                {loading
                                    ? <Skeleton.Node active style={{ width: 190 }} />
                                    : <>
                                        {influencer?.demographicAges?.map((age) => (
                                            <div key={age.detail} className="flex gap-3 items-center justify-between mb-2">
                                                <span className='max-w-[45px] min-w-[45px] text-xs text-gray-500 text-end'>{age.detail}</span>
                                                <div className="min-w-[177px] bg-gray-200 h-4 rounded-md">
                                                    <div
                                                        className="bg-blue-500 h-4 rounded-full"
                                                        style={{ width: `${age.valuePercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className='text-xs text-gray-500'>{age.valuePercentage}%</span>
                                            </div>
                                        ))}
                                    </>
                                }

                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="text-sm text-gray-800 font-medium  mb-4">Location</h3>
                                {loading
                                    ? <Skeleton.Node active style={{ width: 190 }} />
                                    : <>
                                        {influencer?.demographicCities?.map((city) => (
                                            <div key={city.detail} className="flex gap-3 items-center justify-between mb-2">
                                                <span className='max-w-[95px] text-xs text-gray-500 min-w-[95px] text-end'>{city.detail}</span>
                                                <div className="min-w-[177px] bg-gray-200 h-4 rounded-md">
                                                    <div
                                                        className="bg-blue-500 h-4 rounded-full"
                                                        style={{ width: `${city.valuePercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className='text-xs text-gray-500'>{city.valuePercentage}%</span>
                                            </div>
                                        ))}
                                    </>
                                }

                            </div>

                            {/* Gender */}
                            <div className="flex flex-col items-start justify-center pl-12 w-full">
                                <h3 className="text-sm text-gray-800 font-medium ">Gender</h3>
                                <div className='w-full flex items-start  h-full justify-center'>
                                    {loading
                                        ? <Skeleton.Node active style={{ width: 190, marginTop: 14 }} />
                                        : <>
                                            {pieData?.length as number > 0 && (<PieChart data={pieData as any} />)}</>}

                                </div>
                            </div>
                        </div>

                        {/* Portfolio Section */}
                        <div className="mt-8 mb-12">
                            <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {loading
                                    ? <>
                                        <Skeleton.Node active style={{ width: '100%', height: 293 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 293 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 293 }} />
                                    </>
                                    : <>
                                        {influencer?.portfolios?.map((item) => (
                                            <div key={item.id} className="relative">
                                                <img
                                                    src={item?.thumbnail_url || item?.media_url}
                                                    alt={`Portfolio ${item}`}
                                                    className="rounded-lg w-[293px] h-[293px] object-cover"
                                                />
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className='flex items-center gap-1'>
                                                            <HeartIcon width={18} height={18} className='text-gray-500' />
                                                            <span className='text-sm font-medium text-gray-800'>{item.like_count || 0}</span>
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <ChatBubbleOvalLeftIcon width={18} height={18} className='text-gray-500' />
                                                            <span className='text-sm font-medium text-gray-800'>{item.comments_count || 0}</span>
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <PaperAirplaneIcon width={18} height={18} className='text-gray-500' />
                                                            <span className='text-sm font-medium text-gray-800'>{item.share_count || 0}</span>
                                                        </div>
                                                    </div>
                                                    <a href={item.permalink} target="_blank">
                                                        <button className="bg-gray-100 text-gray-800 text-sm font-semibold px-4 py-1 rounded-md">
                                                            Visit
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Drawer>
    )
}

export default ModalViewInfluencerProfile

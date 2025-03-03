import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';

import { Drawer } from 'antd';
//@ts-ignore
import Slider from 'react-slick';
import DefaultAvatar from '~/assets/avatar.jpeg';
import Timeline from '~/assets/time-line.png';
import { Content } from '~/models/Content.model';
import {
  abbreviateLastName,
  formatName,
} from '~/utils/formatNumber';

import {
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  MusicalNoteIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type ModalPreviewContentProps = {
    open: boolean,
    onClose: () => void
    content: Content
}

function ModalPreviewContent({ onClose, open, content }: ModalPreviewContentProps) {

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const contentFormat = content?.campaign?.contentFormat?.[0]
    const videoExtensions = ['mov', 'mp4'];
    const isVideo = content?.urls?.[0] ? videoExtensions?.includes(content?.urls[0]?.slice(-3)) : false;

    return (
        <Drawer
            width={600}
            title="Preview"
            open={open}
            onClose={onClose}
        >
            {/* POST */}
            {contentFormat === 'post' && (
                <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-md shadow-md">
                    {/* Header */}
                    <div className="flex items-center p-3">
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={content?.creator?.avatarUrl || DefaultAvatar}
                            alt="Profile"
                        />
                        <div className="ml-3 pb-2">
                            <p className="font-semibold">{formatName(content?.creator?.name as string)}</p>
                        </div>
                    </div>

                    {/* Image */}
                    <Slider {...settings}>
                        {content?.urls?.map(url => (
                            <img
                                src={url}
                                alt="Post"
                                className="w-[393px] h-[393px] object-cover"
                            />
                        ))}
                    </Slider>

                    {/* Actions */}
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center space-x-3">
                            <HeartIcon className='w-[23px] h-[23px]' />
                            <ChatBubbleOvalLeftIcon className='w-[23px] h-[23px]' />
                            <PaperAirplaneIcon className='w-[23px] -rotate-[45deg] h-[23px] transform -translate-y-[2px]' />
                        </div>
                        <BookmarkIcon className='w-[23px] h-[23px]' />
                    </div>

                    {/* Likes */}
                    <div className="px-4">
                        <p className="font-semibold">0 like</p>
                    </div>

                    {/* Caption */}
                    <div className="px-4 py-2">
                        <p>
                            <span className="font-semibold">{formatName(content?.creator?.name as string)}</span>
                            {abbreviateLastName(content?.caption, 40)}
                        </p>
                    </div>

                    {/* Time */}
                    <div className="px-4 pb-4 text-sm text-gray-500">0 minute ago</div>
                </div>
            )}

            {/* REEL */}
            {contentFormat === 'reel' && (
                <div className="max-w-sm mx-auto relative bg-white border border-gray-200 rounded-md shadow-md">
                    {/* Image Slider */}
                    <div
                        className="relative rounded-lg w-[393px] h-[590px] overflow-hidden"
                    >
                        {/* Profile Section */}
                        <div className="flex items-center p-3 absolute z-20 left-0 bottom-16 ">
                            <img
                                className="w-8 h-8 rounded-full object-cover"
                                src={content?.creator?.avatarUrl || DefaultAvatar}
                                alt="Profile"
                            />
                            <div className="ml-3  flex-1">
                                <p className="font-semibold text-white">{formatName(content?.creator?.name as string)}</p>
                            </div>
                        </div>
                        <video
                            autoPlay
                            loop
                            muted
                            src={content?.urls?.[0]}
                            className="w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
                        ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col absolute right-0 bottom-[20%] items-center justify-between px-4 py-2">
                        <div className="flex items-center flex-col gap-6">
                            <div className='flex flex-col items-center'>
                                <HeartIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className='flex flex-col items-center'>
                                <ChatBubbleOvalLeftIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className='flex flex-col items-center'>
                                <PaperAirplaneIcon className="w-6 h-6 text-white transform" />
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="px-4 absolute bottom-0 flex flex-col items-start left-0 py-2">
                        <p className='text-gray-100'>
                            {abbreviateLastName(content?.caption, 40)}
                        </p>
                        {/* Song Section */}
                        <div className="py-2 flex items-center gap-1">
                            <MusicalNoteIcon className='w-4 h-4 text-white' />
                            <p className="text-sm text-gray-100">song name · Original audio</p>
                        </div>
                    </div>
                </div>
            )}

            {contentFormat === 'story' && (
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-[360px] rounded-xl overflow-hidden shadow-md relative h-[590px] '>
                        <img className='absolute top-1 left-0 w-full z-10' src={Timeline} alt="timeline" />

                        <div className="relative w-full h-full">
                            {/* Video or Image */}

                            {isVideo ? (
                                <video
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    src={content?.urls?.[0]}
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <div
                                    style={{
                                        backgroundImage: `url(${content?.urls?.[0]})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    className="absolute top-0 left-0"
                                />
                            )}

                            {/* Gradient Overlay */}
                            <div
                                className="absolute top-0 left-0 w-full h-full"
                                style={{
                                    background: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))",
                                }}
                            />
                        </div>

                        {/* Overlay Content */}
                        <div className="flex absolute bg-[rgba(0,0,0,0.03)] top-3 left-0 w-full justify-between items-center p-3">
                            <div className='flex items-center'>
                                <img
                                    className="w-10 h-10 rounded-full object-cover"
                                    src={content?.creator?.avatarUrl || DefaultAvatar}
                                    alt="Profile"
                                />
                                <div className="ml-3 pb-2">
                                    <p className="font-semibold text-white">{formatName(content?.creator?.name as string)}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <EllipsisHorizontalIcon className='text-white w-5 h-5' />
                                <XMarkIcon className='text-white h-6 w-6' />
                            </div>
                        </div>

                        <div className='absolute bottom-3 bg-[rgba(0,0,0,0.03)] h-[40px] px-3 flex items-center justify-between left-0 w-full'>
                            <div className='w-[80%] border border-gray-200 flex items-center px-3 rounded-[100px] text-gray-200 h-[36px]'>
                                Send message
                            </div>
                            <div className='flex items-center gap-2 justify-between'>
                                <HeartIcon className='w-6 h-6 text-white' />
                                <PaperAirplaneIcon className=' -rotate-[45deg] text-white w-6 h-6 transform -translate-y-[2px]' />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    )
}

export default ModalPreviewContent

import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';

import {
  Input,
  Skeleton,
} from 'antd';

import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
    return [{ title: 'Review Content' }]
}

const { TextArea } = Input

function ContentDetailSkeleton() {
    return (
        <div className='mx-auto w-full mt-16 justify-center flex items-start gap-7'>
            <div>
                <div className='w-[680px] border border-gray-200 shadow-sm rounded-xl '>
                    <div className='flex border-b border-b-gray-200 items-center justify-between'>
                        <div className='flex items-center p-4 gap-2'>
                            <Skeleton.Button active style={{ height: 25, width: 100, marginLeft: 20, }} />
                        </div>
                        <div className='flex p-4 items-center justify-between gap-3'>
                            <Skeleton.Button active style={{ height: 25, width: 160, marginLeft: 20, padding: 3 }} />
                        </div>
                    </div>
                    <div className='flex p-4 items-start mt-1 gap-3'>

                        <Skeleton.Avatar active shape='circle' style={{ width: 36, height: 36 }} />
                        <div className='flex flex-col items-start'>
                            <Skeleton.Button active style={{ width: 80, height: 20 }} />
                            <Skeleton.Button active style={{ width: 200, height: 18 }} />
                        </div>
                    </div>
                    <div className='px-4 pt-2 pb-4'>
                        <div className='flex items-center gap-2'>
                            <Skeleton.Image active style={{ width: 120, height: 120, borderRadius: 8, }} />
                        </div>
                        <Skeleton.Button active style={{ width: 320, height: 16, marginTop: 16 }} />
                    </div>
                </div>

                {/* Note */}
                <div className='w-[680px] border border-gray-200 shadow-sm rounded-xl mt-5 p-5'>
                    <Skeleton.Button active style={{ height: 20 }} />
                    <div className='text-justify rounded-xl mt-2'>
                        <Skeleton.Button block active style={{ height: 30 }} />
                    </div>
                </div>
            </div>

            {/* Review */}
            <div className='flex flex-col gap-5 w-[330px]'>
                {/* Influencer Requested */}
                <div className='flex flex-col gap-5 w-full'>
                    <div className='flex flex-col gap-5 w-full border border-gray-100 rounded-xl'>
                        <Skeleton.Node active style={{ marginTop: 16, marginLeft: 16, marginRight: 16, width: '90%', height: 60 }} />
                        <div className='w-full justify-between px-4 flex items-center '>
                            <Skeleton.Button active style={{ height: 28, borderRadius: 50 }} />
                            <Skeleton.Button active style={{ height: 28 }} />
                        </div>
                        <Skeleton.Node active style={{ width: '100%', height: 70 }} />
                    </div>
                </div>

                {/* Link website */}
                <div className='w-full border border-gray-100 rounded-xl shadow-sm'>
                    <div className='flex items-start p-4 gap-3'>
                        <div className='flex flex-col gap-1 w-full'>
                            <Skeleton.Button active style={{ width: 100, height: 16 }} />
                            <Skeleton.Button active style={{ width: 200, height: 16 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentDetailSkeleton

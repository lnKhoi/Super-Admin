import React from 'react';

import { Skeleton } from 'antd';

function RoleCardSkeleton() {
    return (
        <div
            className="p-4 border cursor-pointer border-gray-200 shadow-sm rounded-xl  w-full bg-white">
            {/* Role Title */}
            <h3 className="text-lg font-medium"><Skeleton.Input style={{ height: 20 }} active /></h3>

            {/* Created Date */}
            <div className="flex items-center text-gray-500 text-sm mt-1">
                <span><Skeleton.Input style={{ height: 17 }} active /></span>
            </div>

            {/* User Avatars */}
            <div className='flex items-center mt-3'>
                <div className="flex items-center space-x-[-8px]">
                    <Skeleton.Avatar active />
                    <Skeleton.Avatar active />
                </div>
                <div

                    className='flex cursor-pointer items-center gap-2'>
                    <div className='w-9 h-9 rounded-[50%] border-dashed flex items-center justify-center ml-1 border border-gray-200'>
                        <Skeleton.Avatar active />
                    </div>
                    <span className='text-sm font-normal text-gray-800'><Skeleton.Node style={{ height: 22, width: 70 }} active /></span>
                </div>

            </div>
            {/* Buttons */}
            <div className="mt-5 flex gap-2">
                <Skeleton.Button active />
                <Skeleton.Button active />
            </div>

        </div>
    )
}

export default RoleCardSkeleton

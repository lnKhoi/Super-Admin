import React from 'react';
import { Skeleton } from 'antd';

const ReviewCard: React.FC = () => {

  return (
    <div className='h-[300px] p-5 border flex flex-col justify-between border-gray-200 rounded-[20px]'>
      <div className='items-center flex justify-between'>
        <Skeleton.Button active style={{ height: 16 }} />
        <Skeleton.Node active style={{ height: 32, width: 32 }} />
      </div>
      <div className='mt-4f'>
        <Skeleton.Button active style={{ height: 16 }} />
        <div className='flex items-center gap-1'>
          <Skeleton.Button active style={{ height: 16, width: 100 }} />
        </div>
      </div>
      <div className='flex  gap-2'>
        <div className='w-1/2 h-[100px] flex flex-col '>
          <Skeleton.Node active style={{ width: '100%', borderRadius: 16 }} />
        </div>
        <div className='w-1/2 h-[100px] flex flex-col  '>
          <Skeleton.Node active style={{ width: '100%', borderRadius: 16 }} />
        </div>
      </div>
      <div className='flex items-center'>
        <Skeleton.Button active style={{ height: 34, width: 80, borderRadius: 8 }} />
      </div>
    </div>
  );
};

export default ReviewCard;

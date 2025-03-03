import React from 'react';

import { Skeleton } from 'antd';

function Permission() {
  return (
    <div className='w-full'>
      {[1, 2, 3, 4].map((e) => (
        <div key={e}>
          <div className="p-[10px] capitalize text-sm font-medium text-gray-800 w-full">
            <Skeleton.Input active className='w-full min-w-full' style={{ width: '100%' }} />
          </div>
          <div className="grid grid-cols-2">
            {[1, 2, 3, 4].map((per) => (
              <div
                key={per}
                className="text-sm font-medium border-l-0 cursor-pointer hover:bg-gray-50 transition-all text-gray-800 capitalize px-[10px] h-[40px] flex items-center border-gray-200"
              >
                <Skeleton.Input active className='w-full min-w-full' style={{ width: '100%' }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Permission;

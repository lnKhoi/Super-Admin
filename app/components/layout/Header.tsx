import React, { memo } from 'react';

import {
  Dropdown,
  MenuProps,
} from 'antd';
import Avatar from '~/assets/avatar.jpeg';
import { useAuthContext } from '~/contexts/auth.context';

import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

type HeaderProps = {
  title: React.ReactNode;
}


function Header({ title }: HeaderProps) {
  const {handleLogout} = useAuthContext()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => handleLogout()} className='flex items-center gap-3'>
        <ArrowLeftStartOnRectangleIcon className='w-5 h-5 text-gray-500' />
        <span className='text-sm text-gray-500 font-medium'>Logout</span>
        </div>
      ),
    },
  ];


  return (
    <div className='w-full flex h-[60px] min-h-[60px] top-0 left-0 sticky bg-white px-5 items-center border-b border-gray-200 justify-between'>
      <h2 className='text-black font-medium text-[20px]'>{title}</h2>
        <Dropdown trigger={['click']} menu={{ items }} placement="bottomLeft">
        <img src={Avatar} alt="avatar" className='w-[36px] cursor-pointer h-[36px] object-cover rounded-[50%]' />
      </Dropdown>
    </div>
  );
}

export default memo(Header);

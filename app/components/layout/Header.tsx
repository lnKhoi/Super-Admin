import React, { memo } from 'react';

import Avatar from '~/assets/avatar.jpeg';

type HeaderProps = {
  title: React.ReactNode;
}

function Header({ title }: HeaderProps) {
  return (
    <div className='w-full flex h-[60px] min-h-[60px] top-0 left-0 sticky bg-white px-5 items-center border-b border-gray-200 justify-between'>
      <h2 className='text-black font-medium text-[20px]'>{title}</h2>
      <img src={Avatar} alt="avatar" className='w-[36px] h-[36px] object-cover rounded-[50%]' />
    </div>
  );
}

export default memo(Header);

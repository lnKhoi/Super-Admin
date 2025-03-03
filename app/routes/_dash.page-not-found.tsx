import React from 'react';

import { Button } from 'antd';
import NotFound from '~/assets/not-found.png';

import { useNavigate } from '@remix-run/react';

function PageNotFound() {
  const navigate = useNavigate()

  return (
    <div className='flex items-center flex-col justify-center h-screen'>
      <img src={NotFound} className='object-contain -mt-12' alt="not found" />
      <Button onClick={() => navigate('/manager/dashboard')} type='primary' className='transform -translate-y-5 -my-12'>Back to Dashboard</Button>
    </div>
  )
}

export default PageNotFound

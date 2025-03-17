import React from 'react';

import Header from '~/components/layout/Header';

import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: "Billing" },
  ];
};


function Billing() {
  return (
    <div>
      <Header title='Billing' />
    </div>
  )
}

export default Billing

import React from 'react';

import Header from '~/components/layout/Header';

import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: "Organizations" },
  ];
};


function Organizations() {
  return (
    <div>
      <Header title='Organizations' />
    </div>
  )
}

export default Organizations

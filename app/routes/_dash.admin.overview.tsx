import React from 'react';

import Header from '~/components/layout/Header';

import { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: "Overview" },
  ];
};

function Overview() {

  return (
    <div>
      <Header title='Overview' />
    </div>
  )
}

export default Overview

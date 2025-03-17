import React from 'react';

import Header from '~/components/layout/Header';

import { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: "Users" },
  ];
};


function Users() {
  return (
    <div>
      <Header title='Users' />
    </div>
  )
}

export default Users

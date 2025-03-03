import { useCheckAuth } from '~/hooks/useCheckAuth';

import { Outlet } from '@remix-run/react';

export default function Layout() {
  useCheckAuth()
  
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

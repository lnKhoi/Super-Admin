import 'react-toastify/dist/ReactToastify.css';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Segmented,
} from 'antd';
import { ToastContainer } from 'react-toastify';
import ChangePassword from '~/components/profile/ChangePassword';
import MyProfile from '~/components/profile/MyProfile';
import Payment from '~/components/profile/Payment';
import ProfileDetails from '~/components/profile/ProfileDetails';

import {
  Link,
  MetaFunction,
  useParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'My Profile' }];
};

type Tab = 'Profile Details' | 'Billing' | 'Intergration' | 'Change Password'

const Page: React.FC = () => {
  const { id } = useParams();
  const [tab, setTab] = useState<Tab>('Profile Details');

  useEffect(() => {
    const savedTab = localStorage.getItem('profile-tab') as Tab;
    if (savedTab) setTab(savedTab);
  }, []);

  const getCampaignTab = () => {
    switch (tab) {
      case 'Profile Details':
        return <ProfileDetails />;
      case 'Billing':
        return <Payment />;
      case 'Intergration':
        return <MyProfile />;
      case 'Change Password':
        return <ChangePassword />;
      default:
        return null;
    }
  };

  const handleChangeProfileTab = (t: Tab) => {
    setTab(t);
    localStorage.setItem('profile-tab', t);
  };

  return (
    <div>
      <ToastContainer />
      <div className="fixed w-full">
        <div className="relative h-[60px] items-center -ml-5 border-b border-b-gray-200 bg-white z-40 -mt-5 w-[calc(100%-200px)] px-8 flex justify-between">
          <Breadcrumb
            className="w-[200px]"
            items={[
              { title: <Link to={'/manager/dashboard'}>Dashboard</Link> },
              { title: <p className="text-gray-800">My Profile</p> },
            ]}
          />
        </div>
      </div>
      <div className="mt-14">
        <Segmented
          value={tab}
          className="fixed z-50"
          defaultValue={tab}
          style={{ marginBottom: 8 }}
          onChange={(value) => handleChangeProfileTab(value as Tab)}
          options={[
            { label: 'Profile Details', value: 'Profile Details' },
            { label: 'Change Password', value: 'Change Password' },
            { label: 'Billing & Payment', value: 'Billing' },
            { label: 'Integration', value: 'Intergration' },
          ]}
        />
        <div className="pt-14">{getCampaignTab()}</div>
      </div>
    </div>
  );
};

export default Page;

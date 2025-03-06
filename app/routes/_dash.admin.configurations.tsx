import React, {
  useEffect,
  useState,
} from 'react';

import { getMainConfig } from '~/apis/configuration';
import IntegrationSetup from '~/components/configuration/IntegrationSetup';
import Payment from '~/components/configuration/Payment';
import PolicyAndConditions
  from '~/components/configuration/PolicyAndConditions';
import Header from '~/components/layout/Header';
import { CustomConfig } from '~/models/configuration.model';

import {
  BoltIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/react';

type Tab = 'payment' | 'integration' | 'policy';

const tabs = [
  { id: 'payment', label: 'Payment', icon: CreditCardIcon },
  { id: 'integration', label: 'Integration Setup', icon: BoltIcon },
  { id: 'policy', label: 'Policy and Conditions Management', icon: DocumentTextIcon },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Configuration" },
  ];
};

function Configuration() {
  const [active, setActive] = useState<Tab>('payment');
  const [mainConfig, setMainConfig] = useState<CustomConfig | null>(null)

  const handleGetMainConfig = () => {
    getMainConfig().then(res => {
      setMainConfig(res.data)
    })
  }

  useEffect(() => {
    handleGetMainConfig()
  }, [])

  return (
    <>
      <Header title='Configuration' />
      <div className='flex p-5 items-start gap-10'>
        <div className='w-[265px] h-full'>
          {tabs.map(({ id, label, icon: Icon }) => (
            <div
              key={id}
              className={`flex py-2 px-3 rounded-md transition-all cursor-pointer items-center gap-[10px] ${active === id ? 'bg-[#f4f4f4]' : 'bg-white'
                }`}
              onClick={() => setActive(id as Tab)}
            >
              <Icon className='w-5 min-w-5 min-h-5 h-5 text-black' />
              <p className='text-sm'>{label}</p>
            </div>
          ))}
        </div>
        <div className='w-full'>
          {active == 'payment' && <Payment mainConfig={mainConfig as CustomConfig} />}
          {active == 'integration' && <IntegrationSetup mainConfig={mainConfig as CustomConfig} />}
          {active == 'policy' && <PolicyAndConditions />}
        </div>
      </div>
    </>
  );
}

export default Configuration;

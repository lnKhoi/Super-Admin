import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  message,
} from 'antd';
import {
  getLegalAndPolicies,
  updateLegalAndPolicies,
} from '~/apis/policies';
import Header from '~/components/layout/Header';
import Editor from '~/plugins/editor';

import {
  CpuChipIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';
import { MetaFunction } from '@remix-run/cloudflare';

type Tab = 'terms' | 'privacy'

const tabs = [
  { id: 'terms', label: 'Terms of Services', icon: CubeTransparentIcon },
  { id: 'privacy', label: 'Privacy & Policy', icon: CpuChipIcon },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Legal & Policies" },
  ];
};
function LegalPolicies() {
  const [active, setActive] = useState<string>('terms')
  const [terms, setTerms] = useState<string>('')
  const [privacy, setPrivacy] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleGetPolicies = () => {
    getLegalAndPolicies().then(res => {
      setTerms(res.data.termsOfService)
      setPrivacy(res.data.policy)
    })
  }

  useEffect(() => {
    handleGetPolicies()
  }, [])

  const handleUpdateLegalAndPolicies = () => {
    setLoading(true)
    updateLegalAndPolicies({ policy: privacy, termsOfService: terms })
      .then((res) => {
        setTerms(res.data.termsOfService)
        setPrivacy(res.data.policy)
        message.success('Update Successfully!')
      })
      .finally(() => setLoading(false))

  }

  return (
    <div>
      <Header title='Legal & Policies' />
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
        <div className='w-full h-[700px]'>
          {active == 'terms'
            ? <>
              <div style={{ width: '100%' }}>
                <Editor value={terms} onChange={(e) => setTerms(e)} />
              </div>
              <Button loading={loading} onClick={handleUpdateLegalAndPolicies} className='mt-14 float-right' type='primary'>Save</Button>
            </>
            : <>
              <div style={{ width: '100%' }}>
                <Editor value={privacy} onChange={(e) => setPrivacy(e)} />
              </div>
              <Button loading={loading} onClick={handleUpdateLegalAndPolicies} className='mt-14 float-right' type='primary'>Save</Button>
            </>
          }

        </div>
      </div>
    </div>
  )
}

export default LegalPolicies

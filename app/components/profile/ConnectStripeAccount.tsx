import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Modal,
} from 'antd';
import { getOnboardLink } from '~/apis/stripe';
import BankLogo from '~/assets/bank.png';
import StripeLogo from '~/assets/stripe.png';

import {
  ArrowsUpDownIcon,
  ExclamationCircleIcon,
  EyeSlashIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

type ConnectStripeAccount = {
    open: boolean,
    onclose: () => void
}

function ConnectStripeAccount({ onclose, open }: ConnectStripeAccount) {
    const [onboardLink, setOnboardLink] = useState<string>('')

    const handleOnboardUser = () => {
        getOnboardLink().then(res => setOnboardLink(res?.data?.onboardingLink))
    }

    useEffect(() => { handleOnboardUser() }, [])

    return (
        <Modal
            width={650}
            open={open}
            onCancel={onclose}
            footer={<div className='w-full justify-end gap-3 flex mt-8 items-center'>
                <Button onClick={onclose}>Close</Button>
                <Button
                    disabled={onboardLink == ''}
                    onClick={() => window.open(onboardLink, '_blank')}
                    type='primary'>Connect with Stripe</Button>
            </div>}
            title={<span className='flex text-xl font-semibold justify-center items-center text-center'>Connect Your Stripe Account</span>}
        >
            <div className='bg-blue-50 gap-2 mt-8 rounded-lg h-[90px] w-full flex items-center justify-center'>
                <img className='w-[42px] h-[42px] object-cover' src={BankLogo} alt="bank logo" />
                <ArrowsUpDownIcon className='text-gray-500 w-5 h-5 rotate-90' />
                <img className='w-[42px] h-[42px] object-cover' src={StripeLogo} alt="bank logo" />
            </div>

            <div className='mt-4 bg-gray-100 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                    <ShareIcon className='text-blue-500 min-w-5 w-5 h-5' />
                    <div className='fle flex-col gap-2'>
                        <p className='text-sm font-semibold text-gray-800'>Connect effortlessly</p>
                        <p className='text-sm font-normal text-gray-800'>Your receiving account is highly secure, and the information is safely stored by Stripe – one of the leading payment platforms worldwide. Stripe ensures compliance with international security standards (such as PCI-DSS) to protect your account information. </p>
                    </div>
                </div>
                <div className='flex mt-4 items-start gap-3'>
                    <EyeSlashIcon className='text-blue-500 w-5 h-5 min-w-5' />
                    <div className='fle flex-col gap-2'>
                        <p className='text-sm font-semibold text-gray-800'>Your data belong to you</p>
                        <p className='text-sm font-normal text-gray-800'>Our system does not store or process account details directly on our servers; instead, all data is encrypted and securely stored by Stripe.</p>
                    </div>
                </div>
            </div>

            <div className='w-full h-[1px] my-[28px] bg-gray-200'></div>
            <div className='flex items-start gap-2'>
                <ExclamationCircleIcon className='w-5 transform translate-y-1 min-w-5 h-5 text-blue-500' />
                <p>If you encounter any issues during the connection process, Please contact our <span className='text-blue-500'>support@spiral.com</span> for assistance.</p>
            </div>

        </Modal>
    )
}

export default ConnectStripeAccount

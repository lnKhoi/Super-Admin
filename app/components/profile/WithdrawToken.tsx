import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Drawer,
  InputNumber,
  message,
  Radio,
  Skeleton,
} from 'antd';
import {
  getConnectedBankAccount,
  getOnboardLink,
  payout,
} from '~/apis/stripe';
import Balance from '~/assets/balance.png';
import BankLogo from '~/assets/bank-logo.png';
import { Payment } from '~/models/payment.model';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import ConfirmWithdrawToken from './ConfirmWithdrawToken';

type WithdrawTokenProps = {
    open: boolean
    onclose: () => void
    balance: number
    onWithdrawSuccess: () => void
}

function WithdrawToken({ onclose, open, onWithdrawSuccess, balance }: WithdrawTokenProps) {
    const [totalTokens, setTotalTokens] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingBankInfo, setLoadingBankInfo] = useState<boolean>(false)
    const [bankInfo, setBankInfo] = useState<Payment | null>(null)
    const [confirmWithdrawToken, setConfirmWithdrawToken] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleWithdrawToken = () => {
        setLoading(true)
        payout(totalTokens)
            .then(() => { onclose(); onWithdrawSuccess() })
            .finally(() => setLoading(false))
            .catch((err) => messageApi.error(err?.message))
    }

    const handleGetConnectBankAccount = () => {
        setLoadingBankInfo(true)
        getConnectedBankAccount()
            .then(res => setBankInfo(res?.data?.data?.bankAccounts?.[0]))
            .finally(() => setLoadingBankInfo(false))
    }

    useEffect(() => {
        handleGetConnectBankAccount()
    }, [])

    const handleEditStripeAccount = () => {
        getOnboardLink().then(res => window.open(res?.data?.onboardingLink,'_bank'))
    }

    return (
        <>
        {contextHolder}
            <Drawer
                title='Withdraw Token'
                width={650}
                open={open}
                onClose={() => onclose()}
                footer={
                    <div className='flex items-center gap-2 justify-end'>
                        <Button onClick={() => onclose()}>Cancel</Button>
                        <Button
                            loading={loading}
                            onClick={() => setConfirmWithdrawToken(true)}
                            disabled={totalTokens === 0} type='primary'>Withdraw</Button>
                    </div>
                }
            >

                <div>
                    <div className='border border-gray-200 rounded-xl pt-5'>
                        <div className='flex items-center justify-between px-5'>
                            <p className='text-lg font-semibold text-gray-800'>Withdraw from</p>
                            <p className='text-xs font-medium text-gray-500'>Exchange Rage: 1USD = 1 Token</p>
                        </div>

                        <div className='mt-5 border border-gray-200 mx-5 flex gap-4 items-center rounded-xl p-4'>
                            <img src={Balance} alt="balance icon" />
                            <div className='flex items-start flex-col gap-[2px]'>
                                <p className='text-sm font-medium text-gray-800'>Wallet</p>
                                <span className='text-gray-500 text-xs font-normal'>Actual Balance: {balance.toFixed(2)} Tokens</span>
                            </div>
                        </div>

                        <div className='mt-5 mx-5'>
                            <p className='text-sm text-gray-800 font-medium'>Amount</p>
                            <InputNumber
                                min={50}
                                step={0.01}
                                precision={2}
                                max={balance}
                                onChange={(num) => setTotalTokens(Number(num))}
                                className='mt-1 w-full bg-gray-100 border-none h-[44px]' suffix='Token' />
                        </div>
                        <div className='flex items-end  mx-5 flex-col justify-end'>
                            <div className='flex items-center mt-2 justify-end gap-2'>
                                <span className='font-bold text-gray-800 text-base'>Total:</span>
                                <p className='font-bold text-gray-800 text-base'>{totalTokens.toFixed(2)} $</p>
                            </div>
                        </div>

                        <div className='w-full h-[72px] px-6 flex items-center justify-center gap-2 rounded-bl-lg mt-6 rounded-br-lg bg-gray-100'>
                            <ExclamationCircleIcon className='w-5 min-w-5 h-5 transform -translate-y-2 text-blue-500' />
                            <p className='font-normal text-sm text-gray-800'>Withdrawn funds are deducted from the brand's wallet and processed within a defined timeframe (2-7 business days).</p>

                        </div>

                    </div>
                    <div className='mt-8 flex flex-col gap-5'>
                        <div className='flex items-center justify-between'>
                            <p className='font-semibold text-lg text-gray-800'>Payment Method</p>
                            <p onClick={handleEditStripeAccount} className='text-sm font-medium text-blue-500 cursor-pointer'>Change the receiving account</p>
                        </div>

                        <div className='py-4 rounded-xl border-blue-600 flex items-center justify-between px-4 border bg-blue-100'>
                            <div className='flex items-center gap-3'>
                                <img src={BankLogo} alt="Payment Card" />
                                <div className='flex flex-col'>
                                    <p className='text-sm font-medium text-gray-800'>
                                        {loadingBankInfo ? <Skeleton.Node active style={{ height: 18 }} /> : bankInfo?.bank_name}
                                    </p>
                                    <span className='text-xs font-normal mt-[2px] text-gray-500'>
                                        {loadingBankInfo ? <Skeleton.Node active style={{ height: 14 }} /> : `**** ${bankInfo?.last4}`}
                                    </span>
                                </div>
                            </div>
                            <Radio checked />
                        </div>
                    </div>
                </div>

                {/* CONFIRM BUY TOKEN */}
                <ConfirmWithdrawToken
                    paymentMethod={bankInfo?.bank_name as string}
                    total={totalTokens}
                    onConfirm={handleWithdrawToken}
                    open={confirmWithdrawToken}
                    onclose={() => setConfirmWithdrawToken(false)}
                />
            </Drawer>
        </>
    )
}

export default WithdrawToken

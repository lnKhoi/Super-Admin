import React, { useState } from 'react';

import {
  Button,
  Drawer,
  InputNumber,
  Radio,
} from 'antd';
import { toast } from 'react-toastify';
import { buyToken } from '~/apis/stripe';
import Balance from '~/assets/balance.png';
import { paymentMethodBrandLogo } from '~/constants/payment.constant';
import { CreditCard } from '~/models/payment.model';

import ConfirmBuyToken from './ConfirmBuyToken';

type BuyTokenProps = {
    cards: CreditCard[]
    open: boolean
    onclose: () => void
    balance:number
    onPayment: (total: number) => void
}

function BuyToken({ cards, onclose, open, onPayment,balance }: BuyTokenProps) {
    const [totalTokens, setTotalTokens] = useState<number>(0)
    const cardPrimary = cards.find(c => c.is_primary == 1)
    const [loading, setLoading] = useState<boolean>(false)
    const [confirmBuyToken, setConfirmBuyToken] = useState<boolean>(false)

    const transactionFee = totalTokens * 0.1
    const total = totalTokens + transactionFee

    const handleBuyToken = () => {
        setLoading(true)
        buyToken(totalTokens, cardPrimary?.id as string)
            .then(res => {
                onclose()
                onPayment(totalTokens)
            })
            .catch((err) => toast.error(err?.message))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <Drawer
                title='Buy Token'
                width={650}
                open={open}
                onClose={() => onclose()}
                footer={
                    <div className='flex items-center gap-2 justify-end'>
                        <Button onClick={() => onclose()}>Cancel</Button>
                        <Button
                            loading={loading} onClick={() => setConfirmBuyToken(true)}
                            disabled={totalTokens === 0} type='primary'>Top Up</Button>
                    </div>
                }
            >

                <div>
                    <div className='border border-gray-200 rounded-xl p-5'>
                        <div className='flex items-center justify-between'>
                            <p className='text-lg font-semibold text-gray-800'>Top-up To</p>
                            <p className='text-xs font-medium text-gray-500'>Exchange Rage: 1USD = 1 Token</p>
                        </div>

                        <div className='mt-5 border border-gray-200 flex gap-4 items-center rounded-xl p-4'>
                            <img src={Balance} alt="balance icon" />
                            <div className='flex items-start flex-col gap-[2px]'>
                                <p className='text-sm font-medium text-gray-800'>Wallet</p>
                                <span className='text-gray-500 text-xs font-normal'>Actual Balance: {balance.toFixed(2)} Tokens</span>
                            </div>
                        </div>

                        <div className='mt-5'>
                            <p className='text-sm text-gray-800 font-medium'>Top-up Amount</p>
                            <InputNumber
                                min={50}
                                step={0.01}
                                precision={2}
                                max={50000}
                                onChange={(num) => setTotalTokens(Number(num))}
                                className='mt-1 w-full bg-gray-100 border-none h-[44px]' suffix='Token' />
                        </div>

                        <div className='flex items-end  flex-col justify-end'>
                            <div className='flex mt-5  items-center justify-end gap-2'>
                                <span className='font-medium text-gray-500 text-sm'>Transaction Fee (10%):</span>
                                <p className='font-medium text-gray-500 text-sm'>{transactionFee.toFixed(2)} $</p>
                            </div>
                            <div className='flex items-center mt-2 justify-end gap-2'>
                                <span className='font-bold text-gray-800 text-base'>Total:</span>
                                <p className='font-bold text-gray-800 text-base'>{total.toFixed(2)} $</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 flex flex-col gap-5'>
                        <p className='font-semibold text-lg text-gray-800'>Payment Method</p>
                      
                            <div className={`py-4 rounded-xl border-blue-600 flex items-center justify-between px-4 border bg-blue-100`}>
                                <div className='flex items-center gap-3'>
                                    <img className='w-[67px] h-[38px] object-cover' src={paymentMethodBrandLogo[cardPrimary?.brand as keyof typeof paymentMethodBrandLogo]} alt="Payment Card" />
                                    <div className='flex flex-col'>
                                        <p className='text-sm font-medium text-gray-800'>****{cardPrimary?.last4}</p>
                                        <span className='text-xs font-normal mt-[2px] text-gray-500'>Card expires at {cardPrimary?.exp_year}</span>
                                    </div>
                                </div>
                                <Radio checked />
                            </div>
                      
                    </div>
                </div>

                {/* CONFIRM BUY TOKEN */}
                <ConfirmBuyToken
                    paymentMethod={cardPrimary?.brand as string}
                    transactionFee={transactionFee}
                    tokens={totalTokens}
                    total={total}
                    onConfirm={handleBuyToken}
                    open={confirmBuyToken}
                    onclose={() => setConfirmBuyToken(false)}
                />
            </Drawer>
        </>
    )
}

export default BuyToken

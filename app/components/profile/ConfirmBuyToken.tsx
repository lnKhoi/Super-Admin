import React from 'react';

import { Modal } from 'antd';

type ConfirmBuyTokenProps = {
    open: boolean
    onclose: () => void
    onConfirm: () => void
    transactionFee: number
    tokens: number
    paymentMethod: string
    total: number
}
function ConfirmBuyToken({ open, onclose, onConfirm, transactionFee, tokens, total, paymentMethod }: ConfirmBuyTokenProps) {
    return (
        <Modal onOk={() => { onConfirm(); onclose() }} width={356} title='' open={open} onCancel={onclose}>
            <div>
                <h5 className='text-xl font-semibold text-gray-800 text-center mt-4'>Checkout</h5>
                <p className='mt-[6px] text-sm font-normal text-gray-500 text-center'>Double-check the recipient's account details</p>
                <div className='mt-5 flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-500'>Details</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-500'>Service</p>
                        <p className='text-sm font-normal text-gray-500'>{tokens?.toFixed(2)} Token</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-500'>Payment method</p>
                        <p className='text-sm font-normal text-gray-500'>{paymentMethod}</p>
                    </div>
                    <span className='h-[1px] w-full bg-gray-200'></span>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-500'>Transaction Fee (10%)</p>
                        <p className='text-sm font-normal text-gray-500'>${transactionFee.toFixed(2)}</p>
                    </div>
                    <div className='flex items-center mb-4 justify-between'>
                        <p className='text-base font-bold text-gray-500'>Total</p>
                        <p className='text-base font-bold text-gray-500'>${total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmBuyToken

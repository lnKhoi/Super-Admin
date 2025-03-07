import React, { useState } from 'react';

import {
  Button,
  message,
  Modal,
} from 'antd';
import { deleteConfig } from '~/apis/configuration';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type ModalRemoveConfigProps = {
    open: boolean
    onClose: () => void
    id: string
    onSuccess: () => void
}

function ModalRemoveConfig({ onClose, onSuccess, open, id }: ModalRemoveConfigProps) {
    const [loading, setLoading] = useState<boolean>(false)

    const handleRemoveConfig = () => {
        setLoading(true)
        deleteConfig(id).then(res => {
            message.success('Delete Config Successfully!')
            onSuccess()
            onClose()
        })
            .finally(() => setLoading(false))
            .catch(err => message.error(err.message))

    }
    return (
        <Modal footer={null} width={356} open={open} onCancel={onClose} title=''>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-[44px] h-[44px] rounded-[50%] bg-red-100 flex items-center justify-center'>
                    <ExclamationTriangleIcon className='w-5 h-5 text-red-500' />
                </div>

                <h2 className='font-semibold text-xl text-gray-800 mt-5'>Remove Custom Config</h2>
                <p className='w-[308px] mt-[6px] font-normal text-gray-500 text-center'>Are you sure you want to remove this custom configuration? This action will reset the brand's settings to the system defaul.</p>
                <div className='flex items-center gap-3 w-full mt-9'>
                    <Button onClick={onClose} className='w-full'>No</Button>
                    <Button onClick={handleRemoveConfig} loading={loading} className='text-white w-full bg-red-500' >Yes</Button>
                </div>
            </div>

        </Modal>
    )
}

export default ModalRemoveConfig

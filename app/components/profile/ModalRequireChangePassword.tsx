import React from 'react';

import {
  Button,
  Modal,
} from 'antd';
import { updatePasswordDefault } from '~/apis/auth';

import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from '@remix-run/react';

type ModalRequireChangePasswordProps = {
    open: boolean
    onclose: () => void
}

function ModalRequireChangePassword({ onclose, open }: ModalRequireChangePasswordProps) {
    const navigate = useNavigate()

    const handleSkipChangePassword = () => {
        updatePasswordDefault()
        onclose()
    }

    return (
        <Modal open={open} width={380} onCancel={onclose} title='' footer={null}>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-[44px] h-[44px] rounded-[50%] bg-blue-100 flex items-center justify-center'>
                    <LockClosedIcon className='w-5 h-5 text-blue-500' />
                </div>
                <h6 className='text-xl mt-5 font-semibold text-gray-800 text-center'>Update for Security</h6>
                <p className='mt-[6px] text-sm font-normal text-gray-500 text-center'>You are using a temporary password. Please change your password to secure your account.</p>
                <div className='mt-8 flex items-center gap-3 justify-between w-full'>
                    <Button onClick={handleSkipChangePassword} className='w-full font-semibold'>Later</Button>
                    <Button 
                    onClick={() => {
                        navigate('/manager/my-profile')
                        localStorage.setItem('profile-tab', 'Change Password')
                        updatePasswordDefault()
                    }} 
                    className='w-full font-semibold' type='primary'>Change Password</Button>
                </div>

            </div>

        </Modal>
    )
}

export default ModalRequireChangePassword

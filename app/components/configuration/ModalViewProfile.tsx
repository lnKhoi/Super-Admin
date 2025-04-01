import React, {
  useEffect,
  useState,
} from 'react';

import {
  Modal,
  Skeleton,
} from 'antd';
import { getUserDetails } from '~/apis/auth';
import { Brand } from '~/models/User.model';

type ModalViewProfileProps = {
    open: boolean,
    onClose: () => void
    id: string
}

function ModalViewProfile({ onClose, open, id }: ModalViewProfileProps) {
    const [user, setUser] = useState<Brand | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const handleGetUserDetails = () => {
        setLoading(true)
        getUserDetails(id).then(res => setUser(res.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        id !== '' && handleGetUserDetails()
    }, [id])


    return (
        <Modal className='custom-preview' footer={null} title={null} open={open} onCancel={onClose} >
            <div>
                <div className='w-full h-[90px]' style={{
                    background: "linear-gradient(to right, #f6ecf2, #edeaf6, #e5e8fb)",
                }} >
                </div>

                {loading
                    ? <Skeleton.Avatar style={{ width: 96, height: 96, marginLeft: 25, marginTop: -48 }} active />
                    : <div
                        className='flex flex-col ml-5 -mt-12'>
                        <img className='w-[96px] h-[96px] rounded-[50%] object-cover' src={user?.logoUrl} alt="logo" />
                        <p className='text-[20px] font-medium text-gray-800 mt-3'>{user?.name}</p>
                    </div>}
                <div className='mt-5 grid grid-cols-2 px-5 gap-5'>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Business Email</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.businessEmail}</p>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Industry</span>
                        <p className='text-sm font-medium capitalize text-gray-800 mt-1'>{user?.industry?.map(i => i).join(', ')}</p>
                    </div>
                </div>
            </div>
            <div className='mt-5 pb-8 pt-5 border-t px-5 border-gray-200'>
                <h5 className='text-gray-800 font-semibold text-lg'>Contact Point</h5>
                <div className='mt-5 grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>First Name</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.contactPointFirstName}</p>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Last Name</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.contactPointLastName}</p>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Email</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.contactPointEmail}</p>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Role</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.contactPointTitle}</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ModalViewProfile

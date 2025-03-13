import React, {
  useEffect,
  useState,
} from 'react';

import { Modal } from 'antd';
import { getUserDetails } from '~/apis/auth';
import { Brand } from '~/models/User.model';

type ModalViewProfileProps = {
    open: boolean,
    onClose: () => void
    id: string
}

function ModalViewProfile({ onClose, open, id }: ModalViewProfileProps) {
    const [user,setUser] = useState<Brand | null>(null)

    const handleGetUserDetails = () => {
        getUserDetails(id).then(res => setUser(res.data))
    }

    useEffect(() => {
      id !=='' && handleGetUserDetails()
    },[id])

    console.log(user)

    return (
        <Modal footer={null} title={<span className='text-xl'>View Profile</span>} open={open} onCancel={onClose} >
            <div className='pt-6'>
                <h5 className='text-gray-800 font-semibold text-lg'>Brand Details</h5>
                <div className='mt-5 grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Brand Name</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{user?.name}</p>
                    </div>
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
            <div className='mt-5 pb-8 pt-5 border-t border-gray-200'>
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
                    {/* <div className='flex flex-col'>
                        <span className='text-gray-500 font-medium text-sm'>Phone Number</span>
                        <p className='text-sm font-medium text-gray-800 mt-1'>{}</p>
                    </div> */}
                </div>
            </div>
        </Modal>
    )
}

export default ModalViewProfile

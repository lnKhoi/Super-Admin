import React, { useState } from 'react';

import { Input } from 'antd';
import Editor from '~/plugins/editor';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type CreatePolicyProps = {
    onClose: () => void
}
function CreatePolicy({ onClose }: CreatePolicyProps) {
    const [content, setContent] = useState('')

    const handleChangeContent = (content: string) => {
        setContent(content);
    }

    return (
        <div className='max-w-[816px]'>
            <div className='flex items-center gap-3'>
                <div onClick={onClose} className='w-9 h-9 cursor-pointer rounded-md flex items-center justify-center border border-gray-200'>
                    <ArrowLeftIcon className='w-5 h-5 text-black' />
                </div>
                <h6 className='text-black text-xl font-medium'>Edit Policy</h6>
            </div>

            <div className='mt-11 w-[500px]'>
                <Input placeholder='Enter policy name' />
                <div className='mt-4 border-t border-gray-200 mb-6 pt-6'>
                    <Editor value={content} onChange={(value) => handleChangeContent(value)} />
                </div>
            </div>
        </div>
    )
}

export default CreatePolicy

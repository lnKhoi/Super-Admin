import React from 'react';

import Logo from '~/assets/logo.svg';
import Privacy_icon from '~/assets/privacy.svg';

import { MetaFunction } from '@remix-run/cloudflare';
import { useNavigate } from '@remix-run/react';

export const meta: MetaFunction = () => {
    return [{ title: "Spiral - Privacy policy" }];
};

function PrivacyPolicy() {
    const navigate = useNavigate()

    return (
        <div className='p-6'>
            <img onClick={() => navigate('/login')} className='h-[45px] cursor-pointer object-contain' src={Logo} alt="logo" />
            <div className='w-[720px] flex flex-col mx-auto'>
                <div className='flex items-end gap-3'>
                    <img src={Privacy_icon} alt="icon" />
                    <h2 className='text-gray-900 text-[30px] font-bold transform translate-y-1'>Privacy Policy</h2>
                </div>
                <div className='mt-8 mb-3'>
                    <h5 className='text-gray-800 mb-3 font-semibold'>What is Lorem Ipsum?</h5>
                    <p className='text-gray-800'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                    <p className='text-gray-800 mt-5'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
                <div className='mt-8 mb-3'>
                    <h5 className='text-gray-800 mb-3 font-semibold'>Why do we use it?</h5>
                    <p className='text-gray-800'>
                        t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                    </p>
                    <p className='text-gray-800 mt-5'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy

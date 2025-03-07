import React, {
  useEffect,
  useState,
} from 'react';

import {
  Collapse,
  message,
} from 'antd';
import { getListCustomConfigs } from '~/apis/configuration';
import { useAuthContext } from '~/contexts/auth.context';
import type { CustomConfig } from '~/models/configuration.model';

import { PlusIcon } from '@heroicons/react/24/outline';
import {
  useLocation,
  useNavigate,
} from '@remix-run/react';

import ModalAddCustomConfig from '../customConfiguration/ModalAddCustomConfig';

const CustomConfig: React.FC<{ activeCustomConfig: boolean; setActiveCustomConfig: (active: boolean) => void; setActiveMenuItem: (key: string | null) => void; }> = ({ activeCustomConfig, setActiveCustomConfig, setActiveMenuItem }) => {
    const [tab, setTab] = useState<number>(1);
    const navigate = useNavigate();
    const location = useLocation();
    const [modalAddConfig, setModalAddConfig] = useState<boolean>(false);
    const [listConfigs,setListConfigs] = useState<CustomConfig[]>([])
    const {onUpdateCustomConfig} = useAuthContext()

    const [messageApi, contextHolder] = message.useMessage();

    const heightPercentage = tab === 0 ? "100%" : `${(tab / listConfigs.length) * 100}%`;

    useEffect(() => {
        if (location.state === 'custom-config') {
            setActiveCustomConfig(true);
            setActiveMenuItem(null); // Deactivate sidebar menu
        }
    }, [location, setActiveCustomConfig, setActiveMenuItem]);

    const handleCreateNewCustomConfig = (newConfig: CustomConfig) => {
        messageApi.success(`${newConfig.name} created successfully!`)
        setListConfigs([newConfig,...listConfigs])
    }

    useEffect(() => {
        getListCustomConfigs().then(res => setListConfigs(res?.data?.data))
    },[onUpdateCustomConfig])

    const items = [
        {
            key: '1',
            label: (
                <div
                    onClick={() => {
                        setActiveCustomConfig(true);
                        setActiveMenuItem(null); // Deactivate sidebar menu
                    }}
                    className={`flex ${activeCustomConfig ? 'custom-subtab' : ''} text-sm h-[36px] px-3 items-center gap-2 -mt-2 rounded-md`}
                >
                    <PlusIcon
                        width={20}
                        height={20}
                        onClick={(e) => { e.stopPropagation(); setModalAddConfig(true); }}
                        className='w-5 h-5 text-black'
                    />
                    Custom Configuration
                </div>
            ),
            children: (
                <div className='flex -ml-3 justify-between relative'>
                    <div className='bg-black z-20 w-[1.4px] top-0 absolute left-0 transition-all duration-300 ease-in-out' style={{ height: heightPercentage }}></div>
                    <div className='bg-gray-200 w-[1.4px] top-0 absolute z-0 left-0 transition-all duration-300 ease-in-out' style={{ height: '100%' }}></div>
                    <div className='flex pl-5 flex-col gap-2'>
                        {listConfigs?.map((e,idx) => (
                            <p
                                key={e.id}
                                onClick={() => {
                                    setTab(idx + 1);
                                    navigate(`/admin/configuration/${e.id}`, { state: 'custom-config' });
                                    setActiveCustomConfig(true);
                                    setActiveMenuItem(null);
                                }}
                                className={`cursor-pointer text-sm rounded-md ${tab === idx + 1 ? 'text-gray-800 font-medium' : 'text-gray-500 font-normal '}`}
                            >
                                {e.name}
                            </p>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className='custom-config -mt-0.5'>
            {contextHolder}
            <Collapse expandIcon={() => null} className='border-none rounded-md' items={items} />
            <ModalAddCustomConfig
                onSuccess={(newConfig: CustomConfig) => handleCreateNewCustomConfig(newConfig)}
                open={modalAddConfig}
                onclose={() => setModalAddConfig(false)} />
        </div>
    );
};

export default CustomConfig;

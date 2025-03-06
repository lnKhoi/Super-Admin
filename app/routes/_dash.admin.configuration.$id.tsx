import React, {
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  message,
  Skeleton,
} from 'antd';
import dayjs from 'dayjs';
import { getConfigDetails } from '~/apis/configuration';
import User from '~/assets/avatar.jpeg';
import EditIntegrationSetup
  from '~/components/customConfiguration/EditIntegrationSetup';
import EditPayment from '~/components/customConfiguration/EditPayment';
import Header from '~/components/layout/Header';
import { InputSearch } from '~/components/ui/input-search';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { CustomConfig } from '~/models/configuration.model';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useParams } from '@remix-run/react';

function ConfigDetails() {
    const params = useParams()
    const [configDetails, setConfigDetails] = useState<CustomConfig | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleConfigDetails = () => {
        setLoading(true)
        getConfigDetails(params.id as string).then(res => setConfigDetails(res.data))
            .finally(() => setLoading(false))
            .catch(err => messageApi.error(err.message))
    }

    useEffect(() => {
        handleConfigDetails()
    }, [params.id])

    return (
        <div>
            {contextHolder}
            <Header
                title={<div>
                    <Breadcrumb
                        items={[
                            { title: <span className='cursor-pointer'>Custom Configure</span>, },
                            { title: 'View Details', },
                        ]}
                    />
                </div>}
            />

            {/* Content */}
            <div className='m-5'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <h5 className='text-black text-xl font-medium'>
                            {loading ? <Skeleton.Input active style={{ height: 18, width: 120 }} /> : configDetails?.name}
                        </h5>
                        <span className='mt-1 text-gray-500 font-normal text-xs'>Created date: {' '}
                            {loading ? <Skeleton.Input active style={{ height: 12, width: 120, marginTop: 4 }} /> : dayjs(configDetails?.createdAt).format(DATE_TIME_FORMAT)}
                        </span>
                    </div>
                    <Button>Remove</Button>
                </div>

                <div className='mt-11 w-full flex items-start gap-6 '>
                    <div className='w-[37%] shadow-md pb-5 border border-gray-200 rounded-xl '>
                        <div className='bg-gray-100 p-4 font-medium'>Brand</div>
                        <div className='flex items-center justify-between gap-3 w-full mt-3 px-5'>
                            <div className='w-full'>
                                <InputSearch placeholder='Add brand by name or email' />
                            </div>
                            <Button type='primary'>Add</Button>
                        </div>

                        {/* Users */}
                        <div className='m-5'>
                            <div className='flex flex-col gap-3'>
                                {loading
                                    ? <>
                                        <Skeleton.Node active style={{ width: '100%', height: 42 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 42 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 42 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 42 }} />
                                        <Skeleton.Node active style={{ width: '100%', height: 42 }} />
                                    </>
                                    : <>
                                        {configDetails?.brands?.map((b: any) => (
                                            <div className='flex items-center h-[42px] justify-between' key={b?.id as string}>
                                                <div className='flex items-center gap-3'>
                                                    <img src={User} className='w-[36px] h-[36px] rounded-[50%]' alt="avatar" />
                                                    <div>
                                                        <p className='font-medium text-sm text-gray-800'>{b?.name}</p>
                                                        <span className='font-medium text-sm text-gray-500'>{b.email}</span>
                                                    </div>
                                                </div>
                                                <TrashIcon className='w-5 h-5 text-black cursor-pointer' />
                                            </div>
                                        ))}
                                    </>}
                            </div>
                        </div>
                    </div>
                    {/* Payment */}
                    <div className='flex-1 gap-5 flex flex-col'>
                        <EditPayment paymentInfo={configDetails as CustomConfig} loading={loading} />
                        <EditIntegrationSetup paymentInfo={configDetails as CustomConfig} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfigDetails

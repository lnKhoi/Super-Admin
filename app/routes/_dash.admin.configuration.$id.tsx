import React, {
  useEffect,
  useState,
} from 'react';

import {
  Breadcrumb,
  Button,
  message,
  Select,
  Skeleton,
} from 'antd';
import dayjs from 'dayjs';
import {
  addBrandsToConfig,
  deleteBrandFromConfig,
  getBrands,
} from '~/apis/brand';
import { getConfigDetails } from '~/apis/configuration';
import Avatar from '~/assets/avatar.jpeg';
import ModalRemoveConfig from '~/components/configuration/ModalRemoveConfig';
import EditIntegrationSetup
  from '~/components/customConfiguration/EditIntegrationSetup';
import EditPayment from '~/components/customConfiguration/EditPayment';
import Header from '~/components/layout/Header';
import { DATE_TIME_FORMAT } from '~/constants/time.constant';
import { useAuthContext } from '~/contexts/auth.context';
import { CustomConfig } from '~/models/configuration.model';
import type { User } from '~/models/User.model';

import { TrashIcon } from '@heroicons/react/24/outline';
import {
  useNavigate,
  useParams,
} from '@remix-run/react';

function ConfigDetails() {
    const params = useParams()
    const navigate = useNavigate()
    const [configDetails, setConfigDetails] = useState<CustomConfig | null>(null)
    const [messageApi, contextHolder] = message.useMessage();
    const [remove, setRemove] = useState<boolean>(false)
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const { onUpdateCustomConfig, setOnUpdateCustomConfig } = useAuthContext()
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [brands, setBrands] = useState<User[]>([])
    const [loadingType, setLoadingType] = useState<'delete' | 'refresh-brands' | 'loading' | '' | 'add-brands'>('')

    const handleConfigDetails = (type: string) => {
        type == 'loading' ? setLoadingType('loading') : setLoadingType('')
        getConfigDetails(params.id as string).then(res => setConfigDetails(res.data))
            .finally(() => setLoadingType(''))
            .catch(err => messageApi.error(err.message))
    }


    const handlegGetBrands = () => {
        getBrands().then(res => setBrands(res.data.data))
    }

    useEffect(() => {
        handleConfigDetails('loading')
        handlegGetBrands()
    }, [params.id])

    const handleUpdateCustomConfig = (config: CustomConfig) => {
        setConfigDetails(config)
    }

    const handleDeleteCofig = () => {
        navigate('/admin/configurations')
        setOnUpdateCustomConfig(!onUpdateCustomConfig)
    }

    const handleDeleteUser = (id: string) => {
        setLoadingType('delete')
        deleteBrandFromConfig(configDetails?.id as string, id)
            .then(res => {
                message.success('Delete brand successfully!')
                handleConfigDetails('no-loading')
            })
            .finally(() => setLoadingType(''))
            .catch(err => message.error(err.message))
    }

    const handleAddBrandsToConfig = () => {
        setLoadingType('add-brands')
        addBrandsToConfig(configDetails?.id as string, selectedBrands)
            .then(res => {
                message.success('Add brands successfully!')
                setSelectedBrands([])
                handlegGetBrands()
                handleConfigDetails('no-loading')
            })
            .catch(err => message.error(err.message))
            .finally(() => setLoadingType(''))

    }

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
                            {loadingType == 'loading' ? <Skeleton.Input active style={{ height: 18, width: 120 }} /> : configDetails?.name}
                        </h5>
                        <span className='mt-1 text-gray-500 font-normal text-xs'>Created date: {' '}
                            {loadingType == 'loading' ? <Skeleton.Input active style={{ height: 12, width: 120, marginTop: 4 }} /> : dayjs(configDetails?.createdAt).format(DATE_TIME_FORMAT)}
                        </span>
                    </div>
                    <Button onClick={() => setRemove(true)} >Remove</Button>
                </div>

                <div className='mt-11 w-full flex items-start gap-6 '>
                    <div className='w-[37%] shadow-md pb-5 border border-gray-200 rounded-xl '>
                        <div className='bg-gray-100 p-4 font-medium'>Brand</div>
                        <div className='flex items-center justify-between gap-3 w-full mt-3 px-5'>
                            <div className='w-full'>
                                <Select
                                    value={selectedBrands}
                                    className='w-full'
                                    filterOption={(input, option) =>
                                        // @ts-ignore
                                        option?.children?.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(e) => setSelectedBrands(e)}
                                    showSearch
                                    maxTagCount={2} mode='multiple' placeholder="Add brand by name or email">
                                    {brands?.map(b => (
                                        <Select.Option key={b?.id} value={b?.id}>{b?.email}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <Button
                                disabled={selectedBrands.length == 0}
                                loading={loadingType == 'add-brands'}
                                onClick={handleAddBrandsToConfig}
                                type='primary'>
                                Add
                            </Button>
                        </div>

                        {/* Users */}
                        <div className='m-5'>
                            <div className='flex flex-col gap-3'>
                                {loadingType == 'loading'
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
                                                    <img src={Avatar} className='w-[36px] h-[36px] rounded-[50%]' alt="avatar" />
                                                    <div>
                                                        <p className='font-medium text-sm text-gray-800'>{b?.name}</p>
                                                        <span className='font-medium text-sm text-gray-500'>{b.email}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => { handleDeleteUser(b.id); setSelectedUser(b.id) }}
                                                    loading={selectedUser == b.id && loadingType == 'delete'}
                                                    icon={<TrashIcon
                                                        className='w-5 h-5 text-black cursor-pointer' />}>
                                                </Button>

                                            </div>
                                        ))}
                                    </>}
                            </div>
                        </div>
                    </div>
                    {/* Payment */}
                    <div className='flex-1 gap-5 flex flex-col'>
                        <EditPayment
                            onSuccess={(newConfig) => handleUpdateCustomConfig(newConfig)}
                            paymentInfo={configDetails as CustomConfig}
                            loading={loadingType == 'loading'}
                        />
                        <EditIntegrationSetup
                            paymentInfo={configDetails as CustomConfig}
                            loading={loadingType == 'loading'}
                            onSuccess={(newConfig) => handleUpdateCustomConfig(newConfig)}
                        />
                    </div>

                    {/* Remove Config */}
                    <ModalRemoveConfig
                        id={params.id as string}
                        open={remove}
                        onClose={() => setRemove(false)}
                        onSuccess={handleDeleteCofig} />
                </div>
            </div>
        </div>
    )
}

export default ConfigDetails

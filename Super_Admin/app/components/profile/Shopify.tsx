import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Input,
  Skeleton,
} from 'antd';
import {
  connectShopify,
  getShopId,
} from '~/apis/shopify';
import ShopifyLogo from '~/assets/shopify.png';
import type { Shopify } from '~/models/shopify.model';

import { useNavigate } from '@remix-run/react';

function Shopify() {
    const [shopUrl, setShopUrl] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [isLoadingShopify, setIsLoadingShopify] = useState<boolean>(false)
    const [shopifyAccounts, setShopifyAccounts] = useState<Shopify[]>([])
    const navigate = useNavigate()

    const handleConnectShopify = () => {
        setLoading(true)
        connectShopify(shopUrl)
            .then((res) => {
                window.open(`${res?.data?.url}`, '_blank', 'noopener,noreferrer');
            })
            .finally(() => setLoading(false))
    }

    const handleGetShopifyInfo = () => {
        setIsLoadingShopify(true)
        getShopId().then(res => {
            setShopifyAccounts(res.data)
        }).finally(() => setIsLoadingShopify(false))
    }

    useEffect(() => {
        handleGetShopifyInfo()
    }, [])

    return (
        <>
            {shopifyAccounts?.length > 0
                ? <div className='w-[646px] px-5 h-[72px] flex items-center justify-between border border-gray-200 rounded-2xl'>
                    <div className='flex items-center gap-3'>
                        <img className='w-[32px] object-contain ' src={ShopifyLogo} alt="shopify" />
                        <span>{shopifyAccounts?.[0]?.shopUrl}</span>
                    </div>
                    {/* <TrashIcon className='h-5 w-5 cursor-pointer text-gray-500' /> */}
                </div>
                : (
                    <>
                        {isLoadingShopify
                            ? <Skeleton active />
                            : (
                                <div className='w-[450px] mt-2 mx-auto flex flex-col items-center justify-center'>
                                    <img src={ShopifyLogo} alt="shopify" />
                                    <p className='mt-3 text-lg font-semibold'>Connect your Shopify store</p>
                                    <p className='mt-3 text-gray-500 text-sm font-normal text-center'>Easily integrate your Shopify store with our platform to streamline your sales process, manage inventory, and enhance customer experiences. Get started today to unlock powerful features and boost your online business!</p>
                                    <Input
                                        onChange={(e) => setShopUrl(e.target.value)}
                                        suffix='.myshopify.com'
                                        className='mt-8 hover:bg-gray-100 focus:bg-gray-100 bg-gray-100 border-none'
                                        placeholder='yourshopname' />
                                    <div className='w-full mt-4'>
                                        <Button
                                            loading={loading}
                                            onClick={handleConnectShopify}
                                            type='primary'
                                            className='w-full'>
                                            Connect my Store
                                        </Button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    )
}

export default Shopify

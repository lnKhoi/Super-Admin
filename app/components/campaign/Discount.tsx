import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Modal,
  Select,
} from 'antd';
import {
  getDiscountCodeShopify,
  getProducts,
  getShopId,
} from '~/apis/shopify';
import { DISCOUNT_REQUIRED } from '~/constants/messages.constant';
import {
  DiscountCode,
  Product,
} from '~/models/shopify.model';

import { PlusIcon } from '@heroicons/react/24/outline';

import ModalCreateDiscount from './ModalCreateDiscount';

interface DiscountProps {
    form: FormInstance
}
const { RangePicker } = DatePicker;

const Discount = ({ form }: DiscountProps) => {
    const [modal, setModal] = useState<boolean>(false)
    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
    const [products, setProducts] = useState<Product[]>([])
    const [shopId, setShopId] = useState<string>('')
    const formData = form.getFieldsValue()
    const [modalConnectShopify, setModalConnectShopify] = useState<boolean>(false)

    const handleGetShopifyId = () => {
        getShopId().then(res => {
            setShopId(res?.data?.[0]?.id)
            handleGetDiscountCode(res?.data?.[0]?.id)
            handleGetProducts(res?.data?.[0]?.id)
        })
    }

    const handleGetDiscountCode = (shopId: string) => {
        getDiscountCodeShopify(shopId).then((res) => setDiscountCodes(res.data?.discounts))
    }

    const handleGetProducts = (shopId: string) => {
        getProducts(shopId).then(res => setProducts(res.data.products))
    }

    useEffect(() => {
        handleGetShopifyId()
    }, [])


    useEffect(() => {
        formData?.discountCode && form.setFieldValue('removed', formData?.discountCode)
    }, [formData?.discountCode])

    const handleCreateDiscount = () => {
        getShopId().then(res => {
            if (res?.data?.length > 0) {
                setModal(true)
            } else {
                setModalConnectShopify(true)
            }
        })
    }


    return (
        <div className="flex flex-col pt-8 items-start mt-6 border-t border-t-gray-200">
            {/* <ToastContainer /> */}
            {/* Discounts */}
            <p className="text-lg font-semibold">Discount</p>
            <div className="w-full flex items-start justify-between gap-5">
                <Form.Item
                    className="w-full"
                    label=""
                    name="removed"
                    rules={[{ required: true, message: DISCOUNT_REQUIRED }]}
                >
                    <Select
                        placeholder="Select option"
                        className="mt-[5px] w-full"
                        onSelect={(value, option) => {
                            if (form) {
                                form.setFieldValue('discountType', option.discountType);
                                form.setFieldValue('discountCode', option.label);
                                form.setFieldValue('discountValue', option.discountValue);
                            }
                        }}
                        options={discountCodes?.map((c) => ({
                            value: c?.value + c.title + c.value_type,
                            label: c?.title,
                            discountType: c?.value_type,
                            discountValue: c?.value
                        }))}
                    />
                </Form.Item>
            </div>
            <div onClick={handleCreateDiscount} className="text-blue-500 cursor-pointer flex items-center gap-1 text-sm">
                <PlusIcon
                    className="w-4 text-blue-500" />
                Create discount
            </div>

            {/* Products */}
            <p className="text-lg font-semibold mt-5">Product</p>
            <div className="w-full flex items-start justify-between gap-5">
                <Form.Item
                    className="w-full"
                    label=""
                    name="productIds"
                    rules={[{ required: true, message: DISCOUNT_REQUIRED }]}
                >
                    <Select
                        placeholder="Select option"
                        mode="multiple"
                        className="mt-[5px] w-full"
                        options={products?.map((product) => ({
                            value: String(product.id),
                            label: (
                                <div className="flex items-center">
                                    <img
                                        src={product.thumbnail.src}
                                        alt={product.title}
                                        className="w-4 h-4 mr-2"
                                    />
                                    {product.title}
                                </div>
                            ),
                        }))}
                    />
                </Form.Item>
            </div>

            {/* Modal Create Discount */}
            {modal && (
                <ModalCreateDiscount
                    open={modal}
                    onrefresh={handleGetShopifyId}
                    onClose={() => setModal(false)}
                    shopId={shopId}
                    products={products}
                />
            )}

            {/* Modal Connect Shopify */}
            <Modal
                width={356}
                height={210}
                open={modalConnectShopify}
                onCancel={() => setModalConnectShopify(false)}
                footer={<div className='flex w-full mt-7 items-center gap-3'>
                    <Button
                        className='w-1/2'
                        onClick={() => setModalConnectShopify(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            localStorage.setItem('profile-tab', 'Intergration')
                            window.open('/manager/my-profile', '_blank')
                            setModalConnectShopify(false)
                        }}
                        className='w-1/2'
                        type='primary'>
                        Connect now
                    </Button>
                </div>}
                title={<span className='text-xl text-center flex justify-center font-semibold text-gray-800'>Connect Shopify</span>}>
                <p className='text-sm text-center font-normal text-gray-800'>Before creating a discount code, please connect your Shopify account to synchronize data and manage discount codes more easily.</p>

            </Modal>

        </div>
    );
};

export default Discount;

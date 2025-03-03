import {
  getData,
  postData,
} from './axiosClient';

export const connectShopify = (shopName:string) => {
    return getData(`/api/v1/auth/shopifyLogin?shop=${shopName}.myshopify.com`)
}

export const getDiscountCodeShopify = (shopId:string) => {
    return getData(`/api/v1/shop/shopify/${shopId}/discounts`)
}

export const getShopId = () => {
    return getData(`/api/v1/brand/shops`)
}

export const getProducts = (shopId:string) => {
    return getData(`/api/v1/shop/shopify/${shopId}/products`)
}

export const createDiscount = (shopId:string,value:any) => {
    return postData(`/api/v1/shop/shopify/${shopId}/create-discount`,value)
}

export const getOrders = (campaignId:string) => {
    return getData(`/api/v1/order?campaignId=${campaignId}`)
}

export const getOrdersInCampagin = () => {
    return getData(`/api/v1/order?page=1&limit=15`)
}
import {
  getData,
  postData,
} from './axiosClient';

export const addPaymentMethod = () => {
    return postData(`/api/v1/payment/setup-intent`)
}

export const getPaymentMethods = () => {
    return getData(`/api/v1/payment/payment-methods`)
}

export const getPaymentsHistory = (page:number,limit:number) => {
    return getData(`/api/v1/payment/payment-history?page=${page}?limit=${limit}`)
}

export const getTokenTransactionHistory = (page:number,limit:number) => {
    return getData(`/api/v1/payment/token-transaction-history?page=${page}?limit=${limit}`)
}

export const buyToken = (amount: number, paymentId: string) => {
    return postData(`/api/v1/payment/process-payment`, { paymentMethodId: paymentId, amount: amount })
}

export const getTotalTokens = () => {
    return getData(`/api/v1/user/wallet`)
}

export const removePaymentMethod = (id: string) => {
    return postData(`/api/v1/payment/unlink-payment-method`, { paymentMethodId: id })
}

export const downloadInvoice = (id: string) => {
    return getData(`/api/v1/payment/download-invoice/${id}`)
}

export const checkConnectedAccount = () => {
    return getData(`/api/v1/payment/check-connected-account`)
}

export const getOnboardLink = () => {
    return getData(`/api/v1/payment/onboarding-link`)
}

export const payout = (amount: number) => {
    return postData(`/api/v1/payment/process-payout`, { amount: amount })
}

export const setPrimaryCard = (paymentMethodId: string) => {
    return postData(`/api/v1/payment/payment-methods/set-primary`, { paymentMethodId: paymentMethodId })
}

export const getConnectedBankAccount = () => {
    return getData(`api/v1/payment/connected-account/details`)
}
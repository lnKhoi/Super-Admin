import { DateRange } from '~/components/ui/ModalSelectTimeRange';

import { getData } from './axiosClient';

export const getCampaignsInFinance = (page: number, limit: number, search: string) => {
    return getData(`/api/v1/finance/campaigns/financial-details?page=${page}&limit=${limit}&campaignName=${search}`)
}

export const getFinanceMetrics = () => {
    return getData(`/api/v1/finance/campaigns/metrics`)
}

export const getMembersInFinance = (campaignId: string, time: string, dates: DateRange,search:string,page:number,pageSize:number) => {
    const dateRangeQuery = dates
        ? `&from=${dates?.[0]}&to=${dates?.[1]}`
        : '';
    return getData(`/api/v1/finance/campaigns/${campaignId}/creators?page=${page}&limit=${pageSize}?timeRange=${time}${dateRangeQuery}&creatorName=${search}`)
}

export const getCampaignMetrics = (campaignId: string) => {
    return getData(`/api/v1/finance/campaigns/metrics?campaignId=${campaignId}`)
}
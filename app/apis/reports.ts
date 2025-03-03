import { getData } from './axiosClient';
import { FilterDateRange } from './campaign';

export const getCampaignROI = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : '';

    const url = `/api/v1/report/${campaignId}/campaign-roi?timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getCampaignConversionRate = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : '';

    const url = `/api/v1/report/${campaignId}/campaign-performance?timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getCostPerConversion = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : '';

    const url = `/api/v1/report/cost-per-conversion?campaignId=${campaignId}&timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getCostPerClicks = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : '';

    const url = `/api/v1/report/cost-per-click?campaignId=${campaignId}&timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getInfluencerInReport = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : ''; 

    const url = `/api/v1/campaign/${campaignId}/instagram-statistics-list-influencers?timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getIGAudienceOfInfluencer = (campaignId: string, creatorId: string) => {
    return getData(`/api/v1/campaign/${campaignId}/instagram-statistics/${creatorId}`)
}

export const getRevenueOfInfluencer = (creatorId: string) => {
    return getData(`/api/v1/report/${creatorId}/shopify-detail-statistic`)
}


export const getClickThroughRateInReport = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : ''; 

    const url = `/api/v1/report/${campaignId}/ctr?timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getCpaInReport = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : ''; 

    const url = `/api/v1/report/cost-per-acquisition?campaignId=${campaignId}&timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

export const getInfluencerMetric = (creatorId:string) => {
    return getData(`/api/v1/creator/${creatorId}/metrics`)
}
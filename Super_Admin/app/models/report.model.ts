import { Creator } from './User.model';

export type ReportCampaign = {
    totalImpressions: number;
    engagementRate: number;
    totalClicks: number;
    conversionRate: number;
    totalRevenue: number;
    costPerConversion: number;
    costPerClicks: number;
    totalPurchases:number
    roi: number;
    cpa:number
    totalCtr?:number,
    totalCost?:number
    influencers: InfluencerInReport[]
};

export type InfluencerInReport = {
    creatorId?: string;
    totalImpressions?: number;
    totalFollowers?: number;
    revenue?:number
    totalInteractions?: number;
    engagementRate?: number;
    totalPurchases?:number
    totalOrders?:number
    costPerClick?:number
    totalRevenue?:number
    conversionRate?: number;
    totalClicks?:number
    creator?: Creator;
}

export type Metrics = {
    totalRevenue: number;
    totalClicks: number;
    conversionRate: number;
    orderCount: number;
    campaignCount: number;
    costPerClick: number;
    engagementRate: number;
}

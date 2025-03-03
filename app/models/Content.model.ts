import { Campaign } from './Campaign.model';
import { User } from './User.model';

export type Content ={
    id: string;
    campaignId: string;
    creatorId: string;
    urls: string[];
    approved: 'pending' | 'approved' | 'rejected' |'posted' | 'influencer-approved' | 'pending-review' | 'declined'
    approvedBy: string | null;
    reason: string | null;
    caption: string;
    notes: string;
    engagementRate:number
    campaign:Campaign
    postedAt:string
    permalink?:string
    isDeleted: boolean;
    conversionRate:number
    deletedAt: string | null;
    screenshotUrls?:string []
    creator:User
    createdAt: string;
    post_due?:string,
    trackingUrl?:string,
    updatedAt: string;
    versions:ContentVersion[]
  }

  export type ContentVersion = {
    contentId:string,
    version:string
}

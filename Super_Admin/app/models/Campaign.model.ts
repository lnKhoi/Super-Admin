import { User } from './User.model';

export type Campaign = {
    name: string; 
    ages:string []
    deadline: string; 
    id?:string,
    budget: number;
    age?:number []
    gender: 'male' | 'female' | 'all'; 
    discountType: 'percentage' | 'fixed'; 
    status: CampaignStatus
    socialMedia: string[]; 
    maximumParticipants?:number
    location: string; 
    discount: number; 
    campaignOverview: string; 
    isDeleted?: boolean; 
    joinedCreators?:User []
    removed?:string
    discountValue?:number,
    discountCode?:number
    contentFormat?:string[]
    deletedAt?: string; 
  }

 export type CampaignStatus = 'active' | 'draft' | 'archive'
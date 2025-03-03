import { Permission } from './role.model';

export type UserType = 'creator' | 'brand'

export type Auth = {
  email: string
  password: string
}

export type SignupPayload = {
  name?: string
  email?: string
  phone?: string
  industry?: string[]
  category?: string[]
  password?: string
  confirmPassword?: string
}

export type Brand = {
  name?: string;
  id?: string;
  phone?: string;
  industry?: string[];
  category?: string[]
  created_at?: number;
  updated_at?: number;
  timezone?: string
  deleted_at?: number | null;
}

export type User = {
  id: string;
  created_at?: number;
  updated_at?: number;
  isTemporaryPassword?:boolean
  deleted_at?: number | null;
  permissions: Permission[] | Permission
  email?: string;
  role?: 'MANAGER' | 'CREATOR';
  picture?: string | null;
  isDefaultPassword?:boolean
  name?: string;
  permission?:Permission[] | Permission
  brand_id?: string;
  brand?: Brand;
  timezone?: string
  avatarUrl: string
}

export type GoogleAccount = {
  provider: string;
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
  }>;
  photos: Array<{
    value: string;
  }>;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    hd: string;
  };
}

export type Demographic = {
  detail: string,
  valueCount: number,
  valuePercentage: number
}

export type Creator = {
  id?: string,
  name?: string,
  reason?: string
  age?: number,
  platform?: string,
  instagramUsername?: string
  creator?: Creator
  creatorId: string
  isFinalDeadline?: number
  avatarUrl?: string
  creatorSuggestedDeadline?: string | null
  expertises?: string[],
  instagramTotalLikes?: number
  category?: string[]
  email?: string,
  portfolios?: InstagramPost[]
  connectedSocialMedias?: string[]
  biography?: string
  deadline?: string
  instagramFollowsCount?: number
  demographicAges?: Demographic[]
  demographicGenders?: Demographic[]
  demographicCities?: Demographic[]
  instagramMediaCount?: number
  instagramFollowersNumber?: number
  country?: string,
  followersNumber?: number
  gender?: string,
  score?: number
  status?: 'active' | 'inactive' | 'not registered' | 'registered' | 'joined_campaign',
  followers?: number
  alreadyInvited?: boolean
}

export type InstagramPost = {
  id: string;
  caption: string;
  media_type: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO";
  media_url: string;
  thumbnail_url?: string
  share_count?: string,
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export type InfluencerContentStatus = 'waiting_to_apply' | "accepted_invitation" | 'joined_campaign' | 'brand_declined_influencer' | 'declined_invitation'

export type InfluencerInCampaign = {
  creator?: Creator,
  campaignId?: string,
  status: InfluencerContentStatus
  isFinalDeadline?: number
  deadline?: string | null
  previousDeadline?: string
  creatorSuggestedDeadline?: string | null

}

export type InfluencerPerformance = {
  name: string,
  email: string,
  totalImpression: number,
  conversionRate: number,
  engagementRate: number,
  roi: number,
  likes: number,
  totalPurchases: number
  cpa: number
  reach: number
  creator?: Creator
}

export type UserPermission = {
  id: string,
  name?: string,
  email?: string,
  create_at?: string
  archive?:string
  isArchived?:boolean
  role?: string | string[] | { name?: string, id: string }[],
  last_activity_time?: string
  last_activity?: string,
  picture?: string
  joinedDate?: string
}
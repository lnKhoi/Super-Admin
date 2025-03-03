import {
  Filter,
  InviteInfluencer,
} from '~/components/campaign/ModalInviteInfluencerToCampaign';
import { DateRange } from '~/components/ui/ModalSelectTimeRange';
import { Campaign } from '~/models/Campaign.model';

import {
  deleteData,
  getData,
  patchData,
  postData,
} from './axiosClient';

export const createCampaign = (payload: Campaign) => {
    return postData('/api/v1/campaign', payload)
}

export const convertImage = (file: FormData) => {
    return postData('/api/v1/campaign/upload-campaign-overview-media', file)
}

export const getCampaigns = (limit: number, page: number, search: string) => {
    return getData(`/api/v1/campaign?limit=${limit}&page=${page}&keyword=${search}`)
}

export const getCampaignDetails = (id: string) => {
    return getData(`/api/v1/campaign/${id}`)
}

export const updateCampaign = (payload: Campaign, id: string) => {
    return patchData(`/api/v1/campaign/${id}`, payload)
}

export const deleteCampaign = (id: string) => {
    return deleteData(`/api/v1/campaign/${id}`)
}

export const getInfluencerInviteInCampaign = (limit: number, page: 1) => {
    return getData(`/api/v1/brand/imported-influencers?limit=${limit}&page=${page}`)
}

export const getListInfluencerInviteInCampaign = (camaignId: string, limit: number, page: 1, filter: Filter) => {
    return getData(`/api/v1/brand/${camaignId}/creators-for-inviting?limit=${limit}&page=${page}&genders=${filter?.gender}&socialMedias=${filter.socialMedias}&location=${filter.location ?? ''}&followerCount=${(filter?.minFollow !== '' && filter?.maxFollow !== '') ? filter?.minFollow + ',' + filter?.maxFollow : ''}&age=${filter.age?.[0] !== 0 || filter?.age?.[1] !== 100 ? (filter?.age?.[0] + ',' + filter?.age?.[1]) : ''}`)
}

export const inviteInfluencerToCampaign = (camaignId: string, creatorIds: InviteInfluencer[]) => {
    return postData(`/api/v1/brand/${camaignId}/invite`, { creators: creatorIds })
}

export const getInfluencerParticipantsInCampaign = (status: string, campaignId: string, limit: number, page: number) => {
    return getData(`/api/v1/campaign/${campaignId}/influencers?limit=${limit}&page=${page}${status === '' ? '&status=waiting_to_apply,accepted_invitation,joined_campaign' : `&status=declined_invitation`}`)
}

export const brandUpdateInvitationStatus = (campaignId: string, creatorId: string, status: boolean) => {
    return postData(`/api/v1/brand/${campaignId}/${creatorId}/approve`, { approved: status })
}

export const getContentsInCampaign = (campaignId: string, limit: number, page: number) => {
    return getData(`/api/v1/content/campaign/${campaignId}?limit=${limit}&page=${page}`)
}

export const getMediaContentInCampaign = (campaignId: string, media: string) => {
    return getData(`api/v1/content/media/${media}`)
}

export const getContentDetails = (id: string) => {
    return getData(`api/v1/content/${id}`)
}

export const reviewContent = (campaignId: string, contentId: string, reason?: string, status?: boolean) => {
    return postData(`api/v1/brand/${campaignId}/${contentId}/approve-content`, { approved: status, reason: reason })
}

export const rejectContentLink = (contentId: string, reason: string) => {
    return postData(`/api/v1/brand/${contentId}/approve-post-link`, { approve: false, reason: reason })
}

export const getMedia = (campaignId: string, filename: string) => {
    return getData(`/api/v1/content/media/${filename}`)
}

export type FilterDateRange = { time: string, dateRange: DateRange }

export const getInstagramStatistics = (campaignId: string, filter: FilterDateRange) => {
    const dateRangeQuery = filter.dateRange
        ? `&from=${filter.dateRange[0]}&to=${filter.dateRange[1]}`
        : '';

    const url = `api/v1/campaign/${campaignId}/instagram-statistics-total?timeRange=${filter.time}${dateRangeQuery}`;

    return getData(url);
};

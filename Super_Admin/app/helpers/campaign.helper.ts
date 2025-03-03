import { CampaignStatus } from '~/models/Campaign.model';
import { InfluencerContentStatus } from '~/models/User.model';

export const getColorStatusCampaign = (status: CampaignStatus) => {
    switch (status) {
        case 'active':
            return { color: '#0F766E', background: '#CCFBF1' }
        case "archive":
            return { color: '#374151', background: '#E5E7EB' }
        case 'draft':
            return { color: '#1D4ED8', background: '#DBEAFE' }
        default:
            break;
    }
}

export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'posted' | 'influencer-approved' | 'processing' | 'influencer-rejected' | 'declined' | 'in-dispute'

export const getColorStatusContent = (status: ContentStatus) => {
    switch (status) {
        case 'approved':
            return { color: '#0F766E', background: '#CCFBF1', status: 'Approved' }
        case 'influencer-approved':
            return { color: '#0F766E', background: '#CCFBF1', status: 'Ready to post' }
        case 'posted':
            return { color: '#0F766E', background: '#CCFBF1', status: 'Posted' }
        case "in-dispute":
            return { color: '#374151', background: '#E5E7EB', status: 'In Dispute' }
        case "pending":
            return { color: '#374151', background: '#E5E7EB', status: 'Not Reviewed Yet' }
        case "processing":
            return { color: '#374151', background: '#E5E7EB', status: 'Processing' }
        case 'rejected':
            return { color: '#B91C1C', background: '#FEE2E2', status: 'Rejected' }
        case 'influencer-rejected':
            return { color: '#B91C1C', background: '#FEE2E2', status: 'Influencer Rejected' }
        case 'declined':
            return { color: '#B91C1C', background: '#FEE2E2', status: 'Declined' }
        default:
            break;
    }
}


export const getColorInfluencerContent = (status: InfluencerContentStatus) => {
    switch (status) {
        case 'waiting_to_apply':
            return { color: '#374151', background: '#E5E7EB', status: 'Waiting to apply' }
        case "accepted_invitation":
            return { color: '#A16207', background: '#FFEDD5', status: 'Waiting for approve' }
        case 'joined_campaign':
            return { color: '#0F766E', background: '#CCFBF1', status: 'Approved' }
        case 'brand_declined_influencer':
            return { color: '#BE123C', background: '#FFE4E6', status: 'Rejected' }
        case 'declined_invitation':
            return { color: '#BE123C', background: '#FFE4E6', status: 'Rejected' }
        default:

            break;
    }
}
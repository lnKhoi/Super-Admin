import {
  getData,
  postData,
} from './axiosClient';

export const importCSV = (file:FormData) => {
    return postData('/api/v1/brand/upload-csv', file)
}

export const getInfluencerImported = (limit: number, page: number) => {
    return getData(`/api/v1/brand/imported-influencers?limit=${limit}&page=${page}`)
}

export const getInfluencerDetails = (id:string) => {
  return getData(`/api/v1/creator/${id}`)
}

export const getInfluencerConversion = (campaignId:string,creatorId:string) => {
  return getData(`/api/v1/report/${campaignId}/${creatorId}/conversion-rate`)
}

export const getInfluencerTotalClick = (campaignId:string,creatorId:string) => {
  return getData(`/api/v1/report/${campaignId}/${creatorId}/total-clicks`)
}
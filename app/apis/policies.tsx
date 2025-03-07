import {
  getData,
  patchData,
} from './axiosClient';

export const getLegalAndPolicies = () => {
    return getData(`/api/v1/super-admin/legal-and-policies`)
}

export const updateLegalAndPolicies = (payload:any) => {
    return patchData(`/api/v1/super-admin/legal-and-policies`,payload)
}
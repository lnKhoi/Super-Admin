import { CustomConfig } from '~/models/configuration.model';

import {
  getData,
  postData,
} from './axiosClient';

export const getMainConfig = () => {
    return getData(`/api/v1/super-admin/main-config/configuration-detail`)
}

export const createCustomConfig = (payload: CustomConfig) => {
    return postData(`/api/v1/super-admin/create-configuration`, payload)
}

export const getListCustomConfigs = () => {
  return getData(`/api/v1/super-admin/configurations`)
}

export const getConfigDetails = (id:string) => {
  return getData(`/api/v1/super-admin/${id}/configuration-detail`)
}
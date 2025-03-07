import { CustomConfig } from '~/models/configuration.model';

import {
  getData,
  patchData,
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

export const getConfigDetails = (id: string) => {
  return getData(`/api/v1/super-admin/${id}/configuration-detail`)
}

export const updateCustomConfig = (id: string, values: CustomConfig) => {
  return patchData(`/api/v1/super-admin/${id}/configuration`, { payment: values })
}

export const updateMainConfig = (values: CustomConfig) => {
  return patchData(`/api/v1/super-admin/main-config/configuration`, { payment: values })
}

export const updateIntegration = (id: string, values: CustomConfig) => {
  return patchData(`/api/v1/super-admin/${id}/configuration`, values)
}

export const deleteConfig = (id: string) => {
  return patchData(`/api/v1/super-admin/${id}/configuration?isDelete=true`)
}
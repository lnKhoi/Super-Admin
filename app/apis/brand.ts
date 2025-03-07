import {
  getData,
  patchData,
} from './axiosClient';

export const getBrands = () => {
    return getData(`/api/v1/super-admin/brands`)
}

export const deleteBrandFromConfig = (id: string, brandId: string) => {
    return patchData(`/api/v1/super-admin/${id}/configuration?status=remove-brand`, { brandId: [brandId] })
}
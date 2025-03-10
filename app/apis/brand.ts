import {
  getData,
  patchData,
} from './axiosClient';

export const getBrands = () => {
  return getData(`/api/v1/super-admin/brands`)
}
export const deleteBrandFromConfig = (id: string, brandId: string) => {
  return patchData(`/api/v1/super-admin/${id}/configuration?status=remove-brand`, { brands: [brandId] })
}

export const addBrandsToConfig = (id: string, brands: string[]) => {
  return patchData(`/api/v1/super-admin/${id}/configuration?status=add-brand`, { brands: brands })

}
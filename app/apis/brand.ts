import { getData } from './axiosClient';

export const getBrands = () => {
    return getData(`/api/v1/super-admin/brands`)
}
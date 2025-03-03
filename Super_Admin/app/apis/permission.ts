import {
  getData,
  patchData,
  postData,
} from './axiosClient';

export const getPermissions = () => {
    return getData(`/api/v1/role/permissions`)
}

export type CreateUserPayload = {
    emails: string[],
    roles: string[]
}

export type EditUserPayload = {
    email: string,
    roles: string[]
}

export const createUserPermission = (user: CreateUserPayload) => {
    return postData(`/api/v1/role/register/brand-admin`, user)
}

export const editUserPermission = (user: EditUserPayload, id: string) => {
    return patchData(`/api/v1/role/${id}/update-brand-user`, user)
}

export const getUserDetails = (id:string) => {
    return getData(`/api/v1/user/${id}/user-detail-for-brand`)
}
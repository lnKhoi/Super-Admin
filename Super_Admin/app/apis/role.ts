import { Role } from '~/models/role.model';

import {
  getData,
  patchData,
  postData,
} from './axiosClient';

export const createRole = (payload: Role) => {
  return postData(`/api/v1/role/create-role`, payload)
}

export const getRoles = () => {
  return getData(`/api/v1/role/roles`)
}

export const getUsers = (page: number, pageSize: number, search: string) => {
  return getData(`/api/v1/user/manager-list-for-brand?page=${page}&limit=${pageSize}&name=${search || ''}`)
}

export const getRoleDetails = (id: string) => {
  return getData(`/api/v1/role/${id}/role-details`)
}

export const addUsersToRole = (id: string, users: string[]) => {
  return patchData(`/api/v1/role/${id}?status=add-user`, { users: users })
}

export const deleteUsersFromRole = (id: string, users: string[]) => {
  return patchData(`/api/v1/role/${id}?status=remove-user`, { users: users })
}

export const updateRole = (id: string, payload: Role) => {
  return patchData(`/api/v1/role/${id}?status=edit-role`, payload)
}

export const getPermissionOfRole = (id:string) => {
  return getData(`/api/v1/role/permissions?roleId=${id}`)
}
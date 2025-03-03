import {
  Brand,
  SignupPayload,
} from '~/models/User.model';

import {
  getData,
  patchData,
  postData,
} from './axiosClient';

export const login = (email: string, password: string) => {
  return postData(`api/v1/auth/login`, { email, password })
}

export const registerBrand = (payload: SignupPayload) => {
  return postData(`/api/v1/auth/register/brand`, payload)
}

export const registerCreator = (payload: SignupPayload) => {
  return postData(`/api/v1/auth/register/creator`, payload)
}

export const forgotPassword = (email: string) => {
  return postData(`/api/v1/auth/send-mail-forgot-password`, { email })
}

export const resetPassword = (
  password: string,
  confirmPassword: string,
  id: string,
) => {
  return postData(`/api/v1/auth/reset-password/${id}`, {
    password,
    confirmPassword,
  })
}

export const getMe = () => {
  return getData('/api/v1/user/me')
}

export type OTPPayload = {
  otp: string
  userId: string
}

export type ChangePasswordPayload = {
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
}

export const verifyOTP = (payload: OTPPayload) => {
  return postData('/api/v1/auth/validate-otp/active-user', payload)
}

export const login3rdParty = (role: string, email: string, name: string, phone: string) => {
  return postData(`/api/v1/auth/login-3rd-party/${role}`, { email, name, phone })
}

export const resendOTP = (payload: { email: string }) => {
  return postData('/api/v1/auth/resend-otp/reset-password', payload)
}

export const updateUserInfo = (payload: Brand) => {
  return patchData(`/api/v1/brand/update`, payload)
}

export const changePassword = (payload: ChangePasswordPayload) => {
  return patchData(`/api/v1/auth/change-password`, payload)
}

export const archiveUser = (id: string, status: boolean) => {
  return patchData(`api/v1/role/${id}/update-brand-user`, { archive: status })
}

export const updatePasswordDefault = () => {
  return patchData(`/api/v1/auth/postpone-password-change`, { isDefaultPassword: false })
}

export const resendOtp = (email: string) => {
  return postData(`/api/v1/auth/resend-otp/active-user`, { email })
}
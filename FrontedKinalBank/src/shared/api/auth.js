import { axiosAuth } from "./api"

export const loginRequest = (data) =>
  axiosAuth.post('/auth/login', data)

export const registerRequest = (data) =>
  axiosAuth.post('/auth/register', data)

export const forgotPasswordRequest = (data) =>
  axiosAuth.put('/auth/forgot-password', data)

export const profileRequest = () =>
  axiosAuth.get('/auth/profile')
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import axiosInstance from './index'

export const doLogin = async (payload: LoginPayload): Promise<string> => {
  const { data } = await axiosInstance.post<AuthResponse>('/login', payload)

  return data?.access_token as string
}

export const doRegister = async (payload: RegisterPayload) => {
  const { data } = await axiosInstance.post<AuthResponse>('/register', payload)

  return data
}

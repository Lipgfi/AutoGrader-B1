import { request } from './interceptors'
import type { UserLoginRequest, UserRegisterRequest, UserInfo, ApiResponse } from '../types/api'

export const login = async (data: UserLoginRequest): Promise<ApiResponse<{ token: string; refreshToken: string; role: string; userId: string }>> => {
  return await request.post('/auth/login', data)
}

export const register = async (data: UserRegisterRequest): Promise<ApiResponse<{ user_id: number; role: string }>> => {
  return await request.post('/auth/register', data)
}

export const logout = async (): Promise<ApiResponse> => {
  return await request.post('/auth/logout')
}

export const refreshToken = async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string; role: string; userId: string }>> => {
  return await request.post('/auth/refresh', { refreshToken })
}

export const resetPassword = async (email: string): Promise<ApiResponse> => {
  return await request.post('/auth/reset-password', { email })
}

import { request } from './interceptors'

export const getCurrentUser = async () => {
  return await request.get('/users/me')
}

export const updateCurrentUser = async (data: {
  email?: string
  phone?: string
  avatar?: string
  old_password?: string
  new_password?: string
}) => {
  return await request.put('/users/me', data)
}

export const getUsers = async (params?: {
  role?: string
  page?: number
  size?: number
}) => {
  return await request.get('/users', params)
}

export const createTeacher = async (data: {
  teacher_id: string
  email: string
  real_name: string
  department?: string
  initial_password: string
}) => {
  return await request.post('/users', data)
}

export const deleteUser = async (userId: string | number) => {
  return await request.delete(`/users/${userId}`)
}

export const deactivateUser = async (userId: string | number) => {
  return await request.post(`/users/${userId}/deactivate`)
}

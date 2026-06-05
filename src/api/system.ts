import { request } from './interceptors'

export const getSystemStats = async () => {
  return await request.get('/system/stats')
}

export const getSystemHealth = async () => {
  return await request.get('/system/health')
}

export const getAnnouncements = async (params?: {
  course_id?: number
  page?: number
  size?: number
}) => {
  return await request.get('/system/announcements', params)
}

export const createAnnouncement = async (data: {
  course_id?: number
  title: string
  content: string
}) => {
  return await request.post('/system/announcements', data)
}

export const updateAnnouncement = async (announcementId: string | number, data: {
  title?: string
  content?: string
}) => {
  return await request.put(`/system/announcements/${announcementId}`, data)
}

export const deleteAnnouncement = async (announcementId: string | number) => {
  return await request.delete(`/system/announcements/${announcementId}`)
}

export const getSystemLogs = async (params?: {
  user_id?: number
  action?: string
  start_date?: string
  end_date?: string
  page?: number
  size?: number
}) => {
  return await request.get('/system/logs', params)
}

import { request } from './interceptors'

export const getAssignments = async (params?: {
  class_id?: number
  status?: string
  page?: number
  size?: number
}) => {
  return await request.get('/assignments', params)
}

export const getAssignmentDetail = async (assignmentId: string | number) => {
  return await request.get(`/assignments/${assignmentId}`)
}

export const createAssignment = async (data: {
  title: string
  description?: string
  classId: number
  question_id: string
  dueDate: string
  isPublished: boolean
  allowResubmit: boolean
}) => {
  return await request.post('/assignments', data)
}

export const updateAssignment = async (assignmentId: string | number, data: {
  title?: string
  description?: string
  dueDate?: string
  allowResubmit?: boolean
}) => {
  return await request.put(`/assignments/${assignmentId}`, data)
}

export const publishAssignment = async (assignmentId: string | number) => {
  return await request.post(`/assignments/${assignmentId}/publish`)
}

export const deleteAssignment = async (assignmentId: string | number) => {
  return await request.delete(`/assignments/${assignmentId}`)
}

import { request } from './interceptors'

export const getMyGrades = async (params?: {
  assignment_id?: number
}) => {
  return await request.get('/grades/my', params)
}

export const getClassGrades = async (classId: string | number) => {
  return await request.get(`/grades/class/${classId}`)
}

export const exportAssignmentGrades = async (assignmentId: string | number) => {
  return await request.get(`/grades/export/${assignmentId}`)
}

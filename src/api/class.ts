import { request } from './interceptors'

export const getClasses = async (params?: {
  course_id?: number
  page?: number
  size?: number
}) => {
  return await request.get('/classes', params)
}

export const createClass = async (data: {
  courseId: number
  className: string
  classCode: string
}) => {
  return await request.post('/classes', data)
}

export const getClassStudents = async (classId: string | number) => {
  return await request.get(`/classes/${classId}/students`)
}

export const addStudentToClass = async (classId: string | number, data: {
  studentUserId: number
}) => {
  return await request.post(`/classes/${classId}/students`, data)
}

export const importStudentsToClass = async (classId: string | number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return await request.post(`/classes/${classId}/students/import`, formData)
}

export const removeStudentFromClass = async (classId: string | number, studentUserId: string | number) => {
  return await request.delete(`/classes/${classId}/students/${studentUserId}`)
}

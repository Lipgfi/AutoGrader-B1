import { request } from './interceptors'

export const getCourses = async (params?: {
  teacher_id?: number
  semester?: string
  page?: number
  size?: number
}) => {
  return await request.get('/courses', params)
}

export const getCourseDetail = async (courseId: string | number) => {
  return await request.get(`/courses/${courseId}`)
}

export const createCourse = async (data: {
  courseCode: string
  courseName: string
  semester: string
  description?: string
}) => {
  return await request.post('/courses', data)
}

export const updateCourse = async (courseId: string | number, data: {
  courseName?: string
  description?: string
}) => {
  return await request.put(`/courses/${courseId}`, data)
}

export const deleteCourse = async (courseId: string | number) => {
  return await request.delete(`/courses/${courseId}`)
}

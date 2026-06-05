import { request, axiosInstance } from './interceptors'

export const getStudents = async (params?: {
  class_id?: number
  keyword?: string
  page?: number
  size?: number
}) => {
  return await request.get('/students', params)
}

export const importStudents = async (classId?: number, file?: File) => {
  const formData = new FormData()
  if (file) {
    formData.append('file', file)
  }
  
  const url = classId ? `/students/import?class_id=${classId}` : '/students/import'
  return await axiosInstance.post(url, formData, {
    headers: {}
  })
}

export const resetStudentPassword = async (userId: string | number, newPassword?: string) => {
  const params: Record<string, string> = {}
  if (newPassword) {
    params.new_password = newPassword
  }
  return await axiosInstance.post(`/students/${userId}/reset-password`, null, { params })
}

export const updateStudentStatus = async (userId: string | number, isActive: boolean) => {
  return await axiosInstance.patch(`/students/${userId}/status`, null, { params: { is_active: isActive } })
}

export const lookupStudent = async (email: string) => {
  return await request.get('/students/lookup', { email })
}

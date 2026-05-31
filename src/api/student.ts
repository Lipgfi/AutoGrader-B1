import { request, axiosInstance } from './interceptors'

// 获取学生列表
export const getStudents = async (params?: any) => {
  return await request.get('/students', params)
}

// 获取单个学生
export const getStudent = async (userId: string) => {
  return await request.get(`/students/${userId}`)
}

// 添加学生
export const addStudent = async (data: any) => {
  return await request.post('/students', data)
}

// 更新学生信息
export const updateStudent = async (userId: string, data: any) => {
  return await request.put(`/students/${userId}`, data)
}

// 删除学生
export const deleteStudent = async (userId: string) => {
  return await request.delete(`/students/${userId}`)
}

// ============================================
// 修复: 批量导入学生 - 使用 axiosInstance 直接发送 FormData
// ============================================
// 问题根因：request.post 封装会在发送前对数据进行 JSON 序列化或统一处理，
// 导致 FormData 对象被错误转换，后端接收不到 file 字段。
// 修复：使用 axiosInstance 直接发送，但手动包装为统一的 {code, data, msg} 格式
// ============================================
export const importStudents = async (classId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const url = classId ? `/students/import?class_id=${classId}` : '/students/import'

  // 使用 axiosInstance 直接发送，避免 request 封装的中间处理破坏 FormData
  const response = await axiosInstance.post(url, formData, {
    headers: {
      // 注意：不要手动设置 Content-Type，让浏览器自动设置并包含 boundary
      // 'Content-Type': 'multipart/form-data'  // ❌ 不要这样写
    }
  })

  // 手动包装为项目统一的响应格式 {code, data, msg}
  // 适配后端可能的两种返回：
  // 1. 成功: { code: 200, data: {...}, msg: "成功" }
  // 2. 失败: { code: 400, msg: "参数验证失败", data: {...} }
  return {
    code: response.data?.code ?? response.status,
    data: response.data?.data ?? response.data,
    msg: response.data?.msg ?? response.data?.message ?? ''
  }
}

// 重置学生密码
export const resetStudentPassword = async (userId: string, data: any) => {
  return await request.post(`/students/${userId}/reset-password`, data)
}

// 切换学生状态
export const updateStudentStatus = async (userId: string, data: any) => {
  return await request.patch(`/students/${userId}/status`, data)
}
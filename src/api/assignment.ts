import { request } from './interceptors'

// 获取作业列表
export const getAssignments = async (params?: any) => {
  return await request.get('/assignments', params)
}

// 获取作业详情
export const getAssignmentDetail = async (assignmentId: string) => {
  return await request.get(`/assignments/${assignmentId}`)
}

// 创建作业 - 强制使用驼峰命名，与后端一致
export const createAssignment = async (data: any) => {
  // 确保所有字段都是驼峰命名
  const payload = {
    title: data.title,
    classId: Number(data.classId ?? data.class_id),
    questionId: Number(data.questionId ?? data.question_id),
    dueDate: data.dueDate ?? data.due_date ?? data.deadline,
    description: data.description,
    totalScore: data.totalScore ?? data.total_score ?? 100
  }
  
  console.log('createAssignment payload:', JSON.stringify(payload, null, 2))
  
  // 直接调用 axiosInstance.post，确保 data 不被包装
  return await request.post('/assignments', payload)
}

// 更新作业
export const updateAssignment = async (assignmentId: string, data: any) => {
  return await request.put(`/assignments/${assignmentId}`, data)
}

// 发布作业
export const publishAssignment = async (assignmentId: string) => {
  return await request.post(`/assignments/${assignmentId}/publish`)
}

// 删除作业
export const deleteAssignment = async (assignmentId: string) => {
  return await request.delete(`/assignments/${assignmentId}`)
}

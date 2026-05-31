import { request } from './interceptors'

// 获取作业列表
export const getAssignments = async (params?: any) => {
  return await request.get('/assignments', params)
}

// 获取作业详情
export const getAssignmentDetail = async (assignmentId: string) => {
  return await request.get(`/assignments/${assignmentId}`)
}

// 创建作业 - 字段名与 B4 AssignmentCreate 保持一致
export const createAssignment = async (data: any) => {
  const payload = {
    title: data.title,
    classId: Number(data.classId ?? data.class_id),
    question_id: String(data.question_id ?? data.questionId ?? ''),
    dueDate: data.dueDate ?? data.due_date ?? data.deadline,
    description: data.description ?? '',
    isPublished: data.isPublished ?? data.is_published ?? false,
    allowResubmit: data.allowResubmit ?? data.allow_resubmit ?? true
  }

  return await request.post('/assignments', payload)
}

// 更新作业
export const updateAssignment = async (assignmentId: string, data: any) => {
  const payload: Record<string, unknown> = {}

  if (data.title !== undefined) payload.title = data.title
  if (data.description !== undefined) payload.description = data.description

  const dueDate = data.dueDate ?? data.due_date ?? data.deadline
  if (dueDate) payload.dueDate = dueDate

  if (data.allowResubmit !== undefined) payload.allowResubmit = data.allowResubmit

  return await request.put(`/assignments/${assignmentId}`, payload)
}

// 发布作业
export const publishAssignment = async (assignmentId: string) => {
  return await request.post(`/assignments/${assignmentId}/publish`)
}

// 删除作业
export const deleteAssignment = async (assignmentId: string) => {
  return await request.delete(`/assignments/${assignmentId}`)
}

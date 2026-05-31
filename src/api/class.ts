import { request } from './interceptors'

// 获取班级列表
export const getClasses = async (params?: Record<string, any>) => {
  return await request.get('/classes', params)
}

// 创建班级
export const createClass = async (data: Record<string, any>) => {
  const rawCourseId = data.course_id ?? data.courseId
  
  if (rawCourseId === undefined || rawCourseId === null || rawCourseId === '' || rawCourseId === 0) {
    throw new Error('课程ID不能为空')
  }
  
  const numericCourseId = Number(rawCourseId)
  if (isNaN(numericCourseId) || numericCourseId <= 0) {
    throw new Error('课程ID必须是有效的正整数')
  }

  const className = data.class_name ?? data.className
  if (!className || String(className).trim() === '') {
    throw new Error('班级名称不能为空')
  }

  const classCode = data.class_code ?? data.classCode
  if (!classCode || String(classCode).trim() === '') {
    throw new Error('班级代码不能为空')
  }

  // 后端期望驼峰命名
  return await request.post('/classes', {
    courseId: numericCourseId,
    className: String(className).trim(),
    classCode: String(classCode).trim()
  })
}

// 更新班级
export const updateClass = async (classId: string, data: Record<string, any>) => {
  if (!classId) {
    throw new Error('班级ID不能为空')
  }

  const payload: Record<string, any> = {}

  const className = data.class_name ?? data.className
  if (className !== undefined) {
    if (String(className).trim() === '') {
      throw new Error('班级名称不能为空')
    }
    payload.className = String(className).trim()
  }

  const classCode = data.class_code ?? data.classCode
  if (classCode !== undefined) {
    if (String(classCode).trim() === '') {
      throw new Error('班级代码不能为空')
    }
    payload.classCode = String(classCode).trim()
  }

  return await request.put(`/classes/${classId}`, payload)
}

// 获取班级学生
export const getClassStudents = async (classId: string) => {
  if (!classId) throw new Error('班级ID不能为空')
  return await request.get(`/classes/${classId}/students`)
}

// 添加学生到班级
export const addStudentToClass = async (classId: string, data: Record<string, any>) => {
  if (!classId) throw new Error('班级ID不能为空')
  return await request.post(`/classes/${classId}/students`, data)
}

// 批量导入学生
export const importStudents = async (classId: string, data: Record<string, any>) => {
  if (!classId) throw new Error('班级ID不能为空')
  return await request.post(`/classes/${classId}/students/import`, data)
}

// 移除班级学生
export const removeStudentFromClass = async (classId: string, studentUserId: string) => {
  if (!classId) throw new Error('班级ID不能为空')
  if (!studentUserId) throw new Error('学生ID不能为空')
  return await request.delete(`/classes/${classId}/students/${studentUserId}`)
}

// 删除班级
export const deleteClass = async (classId: string) => {
  if (!classId) throw new Error('班级ID不能为空')
  return await request.delete(`/classes/${classId}`)
}

import { MockMethod } from 'vite-plugin-mock'

const mockClasses = [
  {
    id: 'CL001',
    class_id: 'CL001',
    name: '计算机21级1班',
    class_name: '计算机21级1班',
    courseId: 'C001',
    course_id: 'C001',
    courseName: '数据结构与算法',
    class_code: '01',
    studentCount: 35,
    create_time: '2026-03-01 10:00:00'
  },
  {
    id: 'CL002',
    class_id: 'CL002',
    name: '计算机21级2班',
    class_name: '计算机21级2班',
    courseId: 'C001',
    course_id: 'C001',
    courseName: '数据结构与算法',
    class_code: '02',
    studentCount: 32,
    create_time: '2026-03-01 10:00:00'
  },
  {
    id: 'CL003',
    class_id: 'CL003',
    name: '软件21级1班',
    class_name: '软件21级1班',
    courseId: 'C002',
    course_id: 'C002',
    courseName: '操作系统原理',
    class_code: '01',
    studentCount: 28,
    create_time: '2026-03-05 14:00:00'
  }
]

const mockStudentsInClass = [
  {
    id: 'S001',
    user_id: 'U001',
    student_id: '2023010101',
    real_name: '张三',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    joined_at: '2026-03-01 10:00:00'
  },
  {
    id: 'S002',
    user_id: 'U002',
    student_id: '2023010102',
    real_name: '李四',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    joined_at: '2026-03-01 10:00:00'
  },
  {
    id: 'S003',
    user_id: 'U003',
    student_id: '2023010103',
    real_name: '王五',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13800138003',
    joined_at: '2026-03-02 09:00:00'
  }
]

export default [
  {
    url: '/api/v1/classes',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: mockClasses
      }
    }
  },
  {
    url: '/api/v1/classes',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const newClass = {
        id: `CL00${mockClasses.length + 1}`,
        class_id: `CL00${mockClasses.length + 1}`,
        name: body.class_name || body.className,
        class_name: body.class_name || body.className,
        courseId: body.course_id,
        course_id: body.course_id,
        courseName: '新课程',
        class_code: body.class_code || body.classCode,
        studentCount: 0,
        create_time: new Date().toLocaleString('zh-CN')
      }
      mockClasses.push(newClass)
      return {
        code: 201,
        message: '创建成功',
        data: newClass
      }
    }
  },
  {
    url: '/api/v1/classes/:id',
    method: 'delete',
    response: ({ url }: { url: string }) => {
      const id = url.split('/').pop()
      const index = mockClasses.findIndex(c => c.id === id || c.class_id === id)
      if (index > -1) {
        mockClasses.splice(index, 1)
        return {
          code: 200,
          message: '删除成功',
          data: null
        }
      }
      return {
        code: 404,
        message: '班级不存在',
        data: null
      }
    }
  },
  {
    url: '/api/v1/classes/:id/students',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: mockStudentsInClass
      }
    }
  },
  {
    url: '/api/v1/classes/:id/students',
    method: 'post',
    response: ({ body }: { body: any }) => {
      return {
        code: 200,
        message: '添加成功',
        data: {
          student_id: body.studentUserId || body.student_id,
          class_id: body.classId,
          joined_at: new Date().toLocaleString('zh-CN')
        }
      }
    }
  },
  {
    url: '/api/v1/classes/:id/students/:studentId',
    method: 'delete',
    response: () => {
      return {
        code: 200,
        message: '移除成功',
        data: null
      }
    }
  },
  {
    url: '/api/v1/classes/:id/students/import',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '导入成功',
        data: {
          success: 30,
          failed: 0,
          failedList: []
        }
      }
    }
  }
] as MockMethod[]
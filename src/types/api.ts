// API 请求类型定义

// 用户相关
export interface UserLoginRequest {
  username: string
  password: string
  role?: string
}

export interface UserRegisterRequest {
  username: string
  password: string
  real_name: string
  role: string
  email: string
  phone?: string | null
  department?: string | null
  student_id?: string
  teacher_id?: string
}

export interface UserInfo {
  user_id: number
  username: string
  real_name: string
  role: 'student' | 'teacher' | 'admin'
  email: string
  phone?: string | null
  avatar_url?: string | null
  is_active?: boolean
  created_at?: string
  last_login_at?: string | null
  student_id?: string
  teacher_id?: string
  department?: string | null
}

// 课程相关
export interface CourseCreateRequest {
  courseName: string
  courseCode: string
  semester: string
  description?: string
}

export interface Course {
  course_id: number
  course_code: string
  course_name: string
  teacher_id: number
  semester: string
  description?: string | null
  created_at?: string
}

export interface CourseResponse {
  id: number
  course_id: number
  name: string
  course_name: string
  code: string
  course_code: string
  semester: string
  description?: string
  color?: string
  status?: string
  classCount?: number
  assignmentCount?: number
  classes?: Class[]
}

// 班级相关
export interface ClassCreateRequest {
  className: string
  classCode: string
  courseId: number
}

export interface Class {
  class_id: number
  course_id: number
  class_name: string
  class_code: string
  teacher_id: number
  created_at?: string
}

export interface ClassResponse {
  id: number
  class_id: number
  name: string
  class_name: string
  class_code: string
  course_id: number
  course_name?: string
  teacher_id?: number
  studentCount?: number
  student_count?: number
}

// 作业相关
export interface AssignmentCreateRequest {
  title: string
  courseId: string
  classId: string
  questionId: string
  deadline: string
  description?: string
}

export interface Assignment {
  assignment_id: number
  title: string
  description?: string | null
  class_id: number
  teacher_id: number
  due_date: string
  is_published?: boolean
  allow_resubmit?: boolean
  created_at?: string
  published_at?: string | null
  question_id: string
}

export interface AssignmentResponse {
  id: number
  assignment_id: number
  title: string
  courseId?: string
  courseName?: string
  classId?: number
  class_id?: number
  className?: string
  questionId?: string
  question_id?: string
  questionTitle?: string
  due_date?: string
  dueDate?: string
  deadline?: string
  description?: string
  status?: string
  submitRate?: number
  passRate?: number
  totalStudents?: number
  submittedCount?: number
  passedCount?: number
  avgScore?: number
}

// 题目相关
export interface QuestionCreateRequest {
  title: string
  content: string
  difficulty: number
  score: number
  status?: number
  tags?: string[]
  answer?: string
  languages?: string[]
  testCases?: TestCase[]
  options?: QuestionOption[]
  correctOption?: number
  fillBlanks?: FillBlank[]
}

export type QuestionType = 'COMMAND_LINE' | 'FILE_IO' | 'INTERFACE'
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface Question {
  question_id: string
  title: string
  description?: string | null
  type: QuestionType
  difficulty: QuestionDifficulty
  language: string
  time_limit?: number | null
  memory_limit?: number | null
  starter_code?: string | null
  solution_code?: string | null
  is_active?: boolean
  created_at?: string
  created_by?: number | null
}

export interface QuestionResponse {
  id: string
  question_id: string
  title: string
  content?: string
  description?: string
  difficulty: number
  score?: number
  status?: number
  tags?: string[]
  answer?: string
  languages?: string[]
  language?: string
  useCount?: number
  createTime?: string
  type?: QuestionType
  time_limit?: number
  memory_limit?: number
}

export interface TestCase {
  input: string
  expectedOutput: string
  actualOutput?: string
  passed?: boolean
}

export interface QuestionOption {
  content: string
}

export interface FillBlank {
  answer: string
}

// 提交相关
export interface SubmissionCreateRequest {
  questionId: string
  code: string
  language: string
}

export interface Submission {
  submission_id: string
  student_user_id: number
  question_id: string
  assignment_id: number
  code: string
  language: string
  submitted_at?: string
  status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR'
  overall_score?: number
  passed_count?: number
  total_count?: number
  overall_comment?: string
  static_issues?: StaticIssue[]
  case_results?: CaseResult[]
  teacher_score_override?: number | null
  override_reason?: string | null
}

export interface StaticIssue {
  level: 'error' | 'warning' | 'info'
  message: string
  code?: string
}

export interface CaseResult {
  passed: boolean
  case_id: string
  description?: string
  actual_output?: string | null
  expected_output?: string | null
  score?: number
  error?: string
  execution_time_ms?: number
}

export interface SubmissionResponse {
  id: string
  submission_id?: string
  questionId?: string
  question_id?: string
  code?: string
  language?: string
  status?: string
  score?: number
  passed?: boolean
  passedCases?: number
  totalCases?: number
  runtime?: number
  memory?: number
  ranking?: number
  testCases?: TestCase[]
  submitTime?: string
  submitted_at?: string
}

// 成绩相关
export interface Grade {
  id: string
  assignmentId: string
  assignmentName?: string
  questionId: string
  questionTitle?: string
  score: number
  submitTime?: string
}

// 响应类型
export interface ApiResponse<T = any> {
  code: number
  message?: string
  data?: T
}

// 分页响应
export interface PagedResponse<T = any> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

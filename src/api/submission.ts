import { request, axiosInstance } from './interceptors'

export const getMySubmissions = async (params?: {
  assignment_id?: number
}) => {
  return await request.get('/submissions/my', params)
}

export const getSubmissionDetail = async (submissionId: string) => {
  return await request.get(`/submissions/${submissionId}`)
}

export const createSubmission = async (data: {
  question_id: string
  assignment_id: number
  code: string
  language: string
}) => {
  return await request.post('/submissions', data)
}

export const getAssignmentSubmissions = async (assignmentId: string | number) => {
  return await request.get(`/submissions/assignment/${assignmentId}/all`)
}

export const updateSubmissionResult = async (submissionId: string, data: {
  status: string
  overallScore?: number
  passedCount?: number
  totalCount?: number
  overallComment?: string
  staticIssues?: { code: string; message: string }[]
  caseResults?: {
    case_id: string
    description: string
    passed: boolean
    score: number
    actual_output: string | null
    expected_output: string | null
    error: string | null
    execution_time_ms: number
  }[]
  studentUserId?: number
  assignmentId?: number
  questionId?: string
  code?: string
  language?: string
}) => {
  return await request.patch(`/submissions/${submissionId}/result`, data)
}

export const overrideSubmissionScore = async (submissionId: string, overrideScore: number, overrideReason: string) => {
  return await axiosInstance.patch(
    `/submissions/${submissionId}/override`,
    null,
    { params: { override_score: overrideScore, override_reason: overrideReason } }
  )
}

export const getAssignmentStatistics = async (assignmentId: string | number) => {
  return await request.get(`/submissions/statistics/assignment/${assignmentId}`)
}

export const exportSubmissionsExcel = async (assignmentId: string | number) => {
  return await axiosInstance.get(`/submissions/export/assignment/${assignmentId}`, {
    responseType: 'blob'
  })
}

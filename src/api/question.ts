import { request } from './interceptors'

export const getQuestions = async (params?: {
  type?: string
  difficulty?: string
  language?: string
  keyword?: string
  page?: number
  size?: number
}) => {
  return await request.get('/questions', params)
}

export const getQuestionDetail = async (questionId: string, params?: {
  include_test_cases?: boolean
  include_solution?: boolean
}) => {
  return await request.get(`/questions/${questionId}`, params)
}

export const createQuestion = async (data: {
  title: string
  description: string
  type: string
  difficulty: string
  language: string
  time_limit?: number
  memory_limit?: number
  starter_code?: string
  solution_code?: string
  test_cases: {
    input: string
    expected_output: string
    is_public: boolean
    score_weight: number
  }[]
}) => {
  return await request.post('/questions', data)
}

export const updateQuestion = async (questionId: string, data: {
  title?: string
  description?: string
  time_limit?: number
  memory_limit?: number
  starter_code?: string
  is_active?: boolean
}) => {
  return await request.put(`/questions/${questionId}`, data)
}

export const deleteQuestion = async (questionId: string) => {
  return await request.delete(`/questions/${questionId}`)
}

export const getQuestionTestCases = async (questionId: string) => {
  return await request.get(`/questions/${questionId}/testcases`)
}

export const addQuestionTestCase = async (questionId: string, data: {
  input: string
  expected_output: string
  is_public: boolean
  score_weight: number
}[]) => {
  return await request.post(`/questions/${questionId}/testcases`, data)
}

export const deleteQuestionTestCase = async (questionId: string, testCaseId: string | number) => {
  return await request.delete(`/questions/${questionId}/testcases/${testCaseId}`)
}

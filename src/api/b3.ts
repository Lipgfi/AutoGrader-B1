import axios from 'axios'

const b3Instance = axios.create({
  baseURL: '/api/v1/b3',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

b3Instance.interceptors.request.use(
  (config) => {
    console.log('[B3 Request]', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

b3Instance.interceptors.response.use(
  (response) => {
    console.log('[B3 Response]', response.status, response.data)
    return response.data
  },
  (error) => {
    console.warn('[B3 Response Error]', error?.response?.status, error?.config?.url)
    return Promise.reject(error)
  }
)

export interface B3EvaluateRequest {
  question_id: string
  submitted_code: string
  submission_id: string
  language: string
}

export interface B3CaseResult {
  case_id: string
  description: string
  passed: boolean
  score: number
  actual_output: string | null
  expected_output: string | null
  error: string | null
  execution_time_ms: number
}

export interface B3EvaluateResponse {
  question_id: string
  submission_id: string
  overall_score: number
  passed_count: number
  total_count: number
  overall_comment: string
  static_issues: { code: string; message: string }[]
  case_results: B3CaseResult[]
}

export const getB3Questions = async () => {
  return await b3Instance.get('/questions')
}

export const getB3QuestionDetail = async (questionId: string) => {
  return await b3Instance.get(`/questions/${questionId}`)
}

export const createB3Question = async (data: {
  id: string
  title: string
  description: string
  question_type: string
  difficulty: string
  language: string
  allowed_commands: string[]
  metadata_json: Record<string, any>
  test_cases: { input: string; expected_output: string; description: string; score_weight: number }[]
}) => {
  return await b3Instance.post('/questions', data)
}

export const getB3QuestionCases = async (questionId: string) => {
  return await b3Instance.get(`/questions/${questionId}/cases`)
}

export const evaluateSubmission = async (data: B3EvaluateRequest): Promise<B3EvaluateResponse> => {
  const response = await b3Instance.post('/evaluate', data)
  return response as unknown as B3EvaluateResponse
}

export const evaluateAnswer = async (questionId: string) => {
  return await b3Instance.post(`/evaluate/answer/${questionId}`)
}

export const b3HealthCheck = async () => {
  return await b3Instance.get('/health')
}

export default b3Instance

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import router from '../router'

// 创建axios实例
const apiBaseURL = import.meta.env.VITE_B4_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: any) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    console.log('[Request]', config.method?.toUpperCase(), config.url, config.data || config.params)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('[Response]', response.status, response.data)
    return response.data
  },
  (error) => {
    console.error('[Response Error]', error)
    if (error.response) {
      console.error('[Response Error Status]', error.response.status)
      console.error('[Response Error Data]', JSON.stringify(error.response.data, null, 2))
      console.error('[Response Error Headers]', JSON.stringify(error.response.headers, null, 2))

      const data = error.response.data
      const backendMsg = typeof data === 'string' ? data : (data?.detail || data?.msg || data?.message || '')

      switch (error.response.status) {
        case 401:
          ElMessage.error(backendMsg || '未授权，请重新登录')
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break
        case 403:
          ElMessage.error(backendMsg || '拒绝访问')
          break
        case 404:
          ElMessage.error(backendMsg || '请求的资源不存在')
          break
        case 400: {
          if (backendMsg) {
            ElMessage.error(backendMsg)
          } else if (data?.data?.errors) {
            const msgs = data.data.errors.map((e: any) => e.message).join('; ')
            ElMessage.error(msgs || '请求参数错误')
          } else {
            ElMessage.error('请求参数错误')
          }
          break
        }
        case 500:
          ElMessage.error(backendMsg || '服务器内部错误')
          break
        default:
          ElMessage.error(backendMsg || '请求失败')
      }
    } else {
      ElMessage.error('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  }
)

export const request = {
  get: async (url: string, params?: any) => {
    return await axiosInstance.get(url, { params })
  },

  post: async (url: string, data?: any) => {
    return await axiosInstance.post(url, data)
  },

  put: async (url: string, data?: any) => {
    return await axiosInstance.put(url, data)
  },

  patch: async (url: string, data?: any) => {
    return await axiosInstance.patch(url, data)
  },

  delete: async (url: string, params?: any) => {
    return await axiosInstance.delete(url, { params })
  }
}

export default axiosInstance

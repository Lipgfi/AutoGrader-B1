/**
 * 响应数据校验工具
 * 用于验证API响应的完整性和安全性
 */

// API响应基础接口
export interface ApiResponse<T = any> {
  code: number
  msg?: string
  data?: T
}

/**
 * 验证API响应是否有效
 * @param response - 响应对象
 * @param requiredFields - 必需字段列表
 * @returns 是否有效
 */
export const validateResponse = <T>(
  response: any,
  requiredFields: string[] = []
): response is ApiResponse<T> => {
  // 检查响应是否存在且为对象
  if (!response || typeof response !== 'object') {
    console.error('[Validator] 响应不是有效对象:', response)
    return false
  }
  
  // 检查code字段
  if (typeof response.code !== 'number') {
    console.error('[Validator] 响应缺少code字段:', response)
    return false
  }
  
  // 如果有data，检查data是否为对象或数组
  if (response.data !== undefined && response.data !== null) {
    const dataType = typeof response.data
    if (dataType !== 'object') {
      console.error('[Validator] 响应data不是有效类型:', dataType)
      return false
    }
    
    // 检查必需字段
    if (requiredFields.length > 0 && !Array.isArray(response.data)) {
      for (const field of requiredFields) {
        if (!(field in response.data)) {
          console.error('[Validator] 响应data缺少必需字段:', field)
          return false
        }
      }
    }
  }
  
  return true
}

/**
 * 验证JWT Token格式是否正确
 * @param token - JWT Token字符串
 * @returns 是否有效
 */
export const validateTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false
  }
  
  const parts = token.split('.')
  // JWT必须有3个部分：header.payload.signature
  if (parts.length !== 3) {
    return false
  }
  
  try {
    // 验证每个部分都是有效的base64
    atob(parts[0])
    atob(parts[1])
    // 签名部分可能不是标准base64（可能使用URL安全的base64），所以只验证前两部分
    return true
  } catch {
    return false
  }
}

/**
 * 解析JWT Token的payload
 * @param token - JWT Token字符串
 * @returns payload对象或null
 */
export const parseTokenPayload = (token: string): any => {
  if (!validateTokenFormat(token)) {
    return null
  }
  
  try {
    const payload = token.split('.')[1]
    // 处理URL安全的base64
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

/**
 * 检查Token是否过期
 * @param token - JWT Token字符串
 * @returns 是否已过期
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseTokenPayload(token)
  if (!payload || !payload.exp) {
    return true
  }
  
  const expTime = payload.exp * 1000
  return Date.now() >= expTime
}

/**
 * 获取Token剩余有效时间（秒）
 * @param token - JWT Token字符串
 * @returns 剩余秒数，过期返回0
 */
export const getTokenRemainingTime = (token: string): number => {
  const payload = parseTokenPayload(token)
  if (!payload || !payload.exp) {
    return 0
  }
  
  const expTime = payload.exp * 1000
  const remaining = Math.max(0, Math.floor((expTime - Date.now()) / 1000))
  return remaining
}

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否有效
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone - 手机号码
 * @returns 是否有效
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 * - 至少8位
 * - 包含大小写字母和数字
 * @param password - 密码
 * @returns 是否符合要求
 */
export const validatePasswordStrength = (password: string): boolean => {
  if (password.length < 8) {
    return false
  }
  
  // 检查是否包含大写字母、小写字母和数字
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  
  return hasUpper && hasLower && hasNumber
}

/**
 * 安全的JSON解析
 * @param str - JSON字符串
 * @param defaultValue - 默认值
 * @returns 解析结果或默认值
 */
export const safeJsonParse = <T>(str: string, defaultValue: T): T => {
  if (!str) {
    return defaultValue
  }
  
  try {
    return JSON.parse(str) as T
  } catch {
    console.error('[Validator] JSON解析失败:', str)
    return defaultValue
  }
}

/**
 * 安全的类型转换（数字）
 * @param value - 待转换值
 * @param defaultValue - 默认值
 * @returns 数字或默认值
 */
export const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 安全的类型转换（字符串）
 * @param value - 待转换值
 * @param defaultValue - 默认值
 * @returns 字符串或默认值
 */
export const safeString = (value: any, defaultValue: string = ''): string => {
  if (value === null || value === undefined) {
    return defaultValue
  }
  return String(value)
}

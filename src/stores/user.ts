import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 获取用户角色
  const userRole = computed(() => userInfo.value?.role || '')

  // 获取用户ID - 优先使用 user_id（数据库字段），兼容 id
  const userId = computed(() => userInfo.value?.user_id || userInfo.value?.id || userInfo.value?.userId || 0)

  // 获取真实姓名 - 兼容 real_name, realName, name
  const realName = computed(() => userInfo.value?.real_name || userInfo.value?.realName || userInfo.value?.name || '')

  // 获取用户名
  const username = computed(() => userInfo.value?.username || '')

  // 获取学生ID
  const studentId = computed(() => userInfo.value?.student_id || '')

  // 获取教师ID
  const teacherId = computed(() => userInfo.value?.teacher_id || '')

  // 获取院系
  const department = computed(() => userInfo.value?.department || '')

  // 获取邮箱
  const email = computed(() => userInfo.value?.email || '')
  
  // Actions
  function setToken(newToken: string) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    console.log('[UserStore] Token已设置:', !!newToken)
  }
  
  function setUserInfo(info: any) {
    userInfo.value = info
    if (info) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
    console.log('[UserStore] 用户信息已设置:', info?.username, info?.role)
  }
  
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    console.log('[UserStore] 用户已登出')
  }
  
  // 更新用户信息（部分更新）
  function updateUserInfo(partialInfo: any) {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...partialInfo }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      console.log('[UserStore] 用户信息已更新:', partialInfo)
    }
  }
  
  return {
    // 状态
    token,
    userInfo,
    // 计算属性
    isLoggedIn,
    userRole,
    userId,
    realName,
    username,
    studentId,
    teacherId,
    department,
    email,
    // Actions
    setToken,
    setUserInfo,
    logout,
    updateUserInfo
  }
})

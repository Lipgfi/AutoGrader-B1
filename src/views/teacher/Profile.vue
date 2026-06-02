<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-section">
        <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar">
          <el-icon :size="40"><User /></el-icon>
        </el-avatar>
        <el-upload
          class="avatar-upload"
          action="#"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <el-button size="small" type="primary" plain>
            <el-icon><Upload /></el-icon>
            更换头像
          </el-button>
        </el-upload>
      </div>
      <div class="user-info-header">
        <h1>{{ userInfo.name }}</h1>
        <p class="user-role">
          <el-tag type="success" effect="dark">{{ userInfo.role === 'teacher' ? '教师' : userInfo.role }}</el-tag>
          <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'" effect="plain">
            {{ userInfo.status === 'active' ? '正常' : '已停用' }}
          </el-tag>
        </p>
      </div>
    </div>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">基本信息</span>
          <el-button
            v-if="!isEditing"
            type="primary"
            link
            @click="startEdit"
          >
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <template v-else>
            <el-button type="primary" @click="saveEdit">保存</el-button>
            <el-button @click="cancelEdit">取消</el-button>
          </template>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="editForm"
        :rules="formRules"
        label-width="100px"
        class="info-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="工号">
              <el-input
                v-model="userInfo.teacherId"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="工号不可修改" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="editForm.name"
                :disabled="!isEditing"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="院系">
              <el-input
                v-model="userInfo.department"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="院系不可修改" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="editForm.email"
                :disabled="!isEditing"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="editForm.phone"
                :disabled="!isEditing"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="editForm.bio"
            type="textarea"
            :rows="3"
            placeholder="介绍一下自己吧..."
            :disabled="!isEditing"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">修改密码</span>
        </div>
      </template>

      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（6-20位）"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword" :loading="passwordLoading">
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="stats-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">教学统计</span>
        </div>
      </template>

      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon" style="background-color: var(--primary-bg);">
            <el-icon :size="24" style="color: var(--primary-color);"><Reading /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalCourses }}</span>
            <span class="stat-label">教授课程</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon" style="background-color: var(--success-bg);">
            <el-icon :size="24" style="color: var(--success-color);"><Document /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalAssignments }}</span>
            <span class="stat-label">布置作业</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon" style="background-color: var(--warning-bg);">
            <el-icon :size="24" style="color: var(--warning-color);"><User /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalStudents }}</span>
            <span class="stat-label">学生总数</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon" style="background-color: var(--danger-bg);">
            <el-icon :size="24" style="color: var(--danger-color);"><TrendCharts /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.avgSubmitRate }}</span>
            <span class="stat-label">平均提交率</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Upload,
  Edit,
  Lock,
  Reading,
  Document,
  TrendCharts
} from '@element-plus/icons-vue'
import { useUserStore } from '../../stores/user'
import { getCurrentUser, updateCurrentUser } from '../../api/user'
import type { UploadProps, FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const isEditing = ref(false)
const passwordLoading = ref(false)

const userInfo = reactive({
  teacherId: userStore.userInfo?.teacher_id || '',
  name: userStore.userInfo?.real_name || userStore.userInfo?.realName || userStore.userInfo?.name || '',
  email: userStore.userInfo?.email || '',
  phone: userStore.userInfo?.phone || '',
  department: userStore.userInfo?.department || '',
  bio: '',
  avatar: '',
  role: userStore.userInfo?.role || '',
  status: 'active'
})

const editForm = reactive({
  name: userInfo.name,
  email: userInfo.email,
  phone: userInfo.phone,
  bio: userInfo.bio
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const formRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const stats = reactive({
  totalCourses: 0,
  totalAssignments: 0,
  totalStudents: 0,
  avgSubmitRate: '0%'
})

const loadUserProfile = async () => {
  try {
    const response = await getCurrentUser()
    if (response.code === 200 && response.data) {
      const serverUser = response.data
      console.log('[TeacherProfile] 获取到用户信息:', serverUser)

      Object.assign(userInfo, {
        teacherId: serverUser.teacher_id || '',
        name: serverUser.real_name || serverUser.name || '',
        email: serverUser.email || '',
        phone: serverUser.phone || '',
        department: serverUser.department || '',
        avatar: serverUser.avatar_url || '',
        role: serverUser.role || userStore.userRole
      })

      Object.assign(editForm, {
        name: serverUser.real_name || serverUser.name || '',
        email: serverUser.email || '',
        phone: serverUser.phone || '',
        bio: userInfo.bio
      })

      userStore.updateUserInfo({
        ...userStore.userInfo,
        real_name: serverUser.real_name,
        name: serverUser.real_name,
        teacher_id: serverUser.teacher_id,
        email: serverUser.email,
        phone: serverUser.phone,
        avatar_url: serverUser.avatar_url,
        department: serverUser.department
      })
    }
  } catch (error) {
    console.error('[TeacherProfile] 获取用户信息失败:', error)
  }
}

onMounted(() => {
  loadUserProfile()
})

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    userInfo.avatar = e.target?.result as string
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(rawFile)
  return false
}

const startEdit = () => {
  isEditing.value = true
  Object.assign(editForm, {
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio
  })
}

const saveEdit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const response = await updateCurrentUser({
      email: editForm.email,
      phone: editForm.phone
    })

    if (response.code === 200) {
      Object.assign(userInfo, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone
      })

      userStore.updateUserInfo({
        ...userStore.userInfo,
        email: editForm.email,
        phone: editForm.phone
      })

      isEditing.value = false
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(response.msg || '保存失败')
    }
  } catch (error: any) {
    const msg = error?.response?.data?.detail || '保存失败'
    ElMessage.error(msg)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(editForm, {
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio
  })
}

const changePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true

    await updateCurrentUser({
      old_password: passwordForm.oldPassword,
      new_password: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error: any) {
    const msg = error?.response?.data?.detail || '密码修改失败'
    ElMessage.error(msg)
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
.profile-container {
  padding: var(--spacing-xl);
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-light);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  background-color: var(--primary-bg);
  color: var(--primary-color);
}

.user-info-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-md);
}

.user-info-header h1 {
  margin: 0;
  font-size: var(--font-size-xxl);
  color: var(--text-primary);
}

.user-role {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.info-card,
.password-card,
.stats-card {
  margin-bottom: var(--spacing-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.info-form {
  margin-top: var(--spacing-md);
}

.disabled-icon {
  color: var(--text-placeholder);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>

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
          <el-tag type="primary" effect="dark">{{ userInfo.role }}</el-tag>
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
            <el-form-item label="学号">
              <el-input
                v-model="userInfo.studentId"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="学号不可修改" placement="top">
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
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="editForm.gender" :disabled="!isEditing">
                <el-radio value="male">男</el-radio>
                <el-radio value="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期"
                :disabled="!isEditing"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="editForm.email"
                :disabled="!isEditing"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="editForm.phone"
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
            <el-form-item label="班级">
              <el-input
                v-model="userInfo.className"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="班级不可修改" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="密码状态">
              <el-tag :type="userInfo.firstPasswordChanged ? 'success' : 'warning'">
                {{ userInfo.firstPasswordChanged ? '已修改初始密码' : '未修改初始密码' }}
              </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户ID">
              <el-input
                v-model="userInfo.userId"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="用户ID不可修改" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input
                v-model="userInfo.createdAt"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="创建时间不可修改" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后登录">
              <el-input
                v-model="userInfo.lastLoginAt"
                disabled
              >
                <template #suffix>
                  <el-tooltip content="最后登录时间" placement="top">
                    <el-icon class="disabled-icon"><Lock /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
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
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Upload, 
  Edit, 
  Lock 
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
  studentId: userStore.userInfo?.studentId || userStore.userInfo?.student_id || '',
  userId: userStore.userInfo?.userId || userStore.userInfo?.user_id || '',
  name: userStore.userInfo?.realName || userStore.userInfo?.real_name || userStore.userInfo?.name || '',
  gender: userStore.userInfo?.gender || 'male',
  birthday: userStore.userInfo?.birthday || '',
  email: userStore.userInfo?.email || '',
  phone: userStore.userInfo?.phone || '',
  department: userStore.userInfo?.department || '',
  className: userStore.userInfo?.className || '',
  bio: userStore.userInfo?.bio || '',
  avatar: userStore.userInfo?.avatar || userStore.userInfo?.avatar_url || '',
  role: userStore.userInfo?.role || '',
  status: userStore.userInfo?.status || userStore.userInfo?.is_active ? 'active' : 'inactive',
  firstPasswordChanged: userStore.userInfo?.firstPasswordChanged || userStore.userInfo?.first_password_changed || false,
  createdAt: userStore.userInfo?.createdAt || userStore.userInfo?.created_at || '',
  lastLoginAt: userStore.userInfo?.lastLoginAt || userStore.userInfo?.last_login_at || ''
})

const editForm = reactive({
  name: userInfo.name,
  gender: userInfo.gender,
  birthday: userInfo.birthday,
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
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
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
    gender: userInfo.gender,
    birthday: userInfo.birthday,
    email: userInfo.email,
    phone: userInfo.phone,
    bio: userInfo.bio
  })
}

const saveEdit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    await updateCurrentUser({
      real_name: editForm.name,
      email: editForm.email,
      phone: editForm.phone
    })
    
    Object.assign(userInfo, editForm)
    isEditing.value = false
    ElMessage.success('保存成功')
  } catch (error: any) {
    console.error('保存失败', error)
    const msg = error?.response?.data?.detail || '保存失败'
    ElMessage.error(msg)
  }
}

const cancelEdit = () => {
  isEditing.value = false
  Object.assign(editForm, {
    name: userInfo.name,
    gender: userInfo.gender,
    birthday: userInfo.birthday,
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

const loadUserInfo = async () => {
  try {
    const response = await getCurrentUser()
    if (response.code === 200 && response.data) {
      const data = response.data
      userInfo.studentId = data.student_id || data.studentId || ''
      userInfo.userId = data.user_id || data.userId || ''
      userInfo.name = data.real_name || data.realName || data.name || ''
      userInfo.email = data.email || ''
      userInfo.phone = data.phone || ''
      userInfo.avatar = data.avatar_url || data.avatar || ''
      userInfo.role = data.role || ''
      userInfo.status = data.is_active ? 'active' : 'inactive'
      userInfo.createdAt = data.created_at || data.createdAt || ''
      userInfo.lastLoginAt = data.last_login_at || data.lastLoginAt || ''
      userInfo.firstPasswordChanged = data.first_password_changed || data.firstPasswordChanged || false
      userInfo.department = data.department || ''
      
      editForm.name = userInfo.name
      editForm.email = userInfo.email
      editForm.phone = userInfo.phone
      
      userStore.updateUserInfo(data)
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

onMounted(() => {
  loadUserInfo()
})
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
  border: 4px solid var(--primary-color);
  box-shadow: var(--shadow-light);
}

.user-info-header h1 {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.user-role {
  display: flex;
  gap: var(--spacing-sm);
  margin: 0;
}

.info-card,
.password-card {
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.info-form {
  padding-top: var(--spacing-md);
}

.disabled-icon {
  color: var(--text-disabled);
}

.password-form {
  max-width: 500px;
  padding-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .profile-container {
    padding: var(--spacing-md);
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-info-header h1 {
    font-size: var(--font-size-xl);
  }
}
</style>

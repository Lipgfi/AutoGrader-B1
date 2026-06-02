<template>
  <div class="admin-dashboard-container">
    <div class="page-header">
      <div class="header-left">
        <h1>管理控制台</h1>
        <p class="header-desc">系统运行状态概览</p>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
        <el-button
          icon="ArrowRight"
          @click="handleLogout"
          class="logout-btn"
        >
          退出登录
        </el-button>
      </div>
    </div>
    
    <div class="stats-overview">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon primary">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">用户总数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon success">
            <el-icon :size="28"><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalCourses }}</span>
            <span class="stat-label">课程总数</span>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon warning">
            <el-icon :size="28"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalAssignments }}</span>
            <span class="stat-label">作业总数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon danger">
            <el-icon :size="28"><EditPen /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalSubmissions }}</span>
            <span class="stat-label">提交总数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon info">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalStudents }}</span>
            <span class="stat-label">学生数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon purple">
            <el-icon :size="28"><Briefcase /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalTeachers }}</span>
            <span class="stat-label">教师数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon cyan">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalClasses }}</span>
            <span class="stat-label">班级数</span>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon orange">
            <el-icon :size="28"><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.pendingSubmissions }}</span>
            <span class="stat-label">待处理</span>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="main-content">
      <el-card class="pie-chart-card">
        <template #header>
          <span class="card-title">用户分布</span>
        </template>
        <div class="pie-chart-container">
          <div class="pie-chart">
            <div class="pie-segment student" :style="{ '--percentage': studentPercentage }"></div>
            <div class="pie-segment teacher" :style="{ '--percentage': teacherPercentage }"></div>
            <div class="pie-segment admin" :style="{ '--percentage': adminPercentage }"></div>
            <div class="pie-center">
              <span class="pie-total">{{ stats.totalUsers }}</span>
              <span class="pie-label">总用户</span>
            </div>
          </div>
          <div class="pie-legend">
            <div class="legend-item">
              <span class="legend-color student"></span>
              <span class="legend-label">学生</span>
              <span class="legend-value">{{ (studentPercentage * 100).toFixed(1) }}%</span>
            </div>
            <div class="legend-item">
              <span class="legend-color teacher"></span>
              <span class="legend-label">教师</span>
              <span class="legend-value">{{ (teacherPercentage * 100).toFixed(1) }}%</span>
            </div>
            <div class="legend-item">
              <span class="legend-color admin"></span>
              <span class="legend-label">管理员</span>
              <span class="legend-value">{{ (adminPercentage * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stats-detail-card">
        <template #header>
          <span class="card-title">系统概览</span>
        </template>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-icon-wrapper primary"><el-icon><User /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.totalUsers }}</span>
              <span class="stat-name">总用户</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon-wrapper success"><el-icon><Reading /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.totalCourses }}</span>
              <span class="stat-name">课程</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon-wrapper warning"><el-icon><Document /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.totalAssignments }}</span>
              <span class="stat-name">作业</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon-wrapper danger"><el-icon><EditPen /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.totalSubmissions }}</span>
              <span class="stat-name">提交</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon-wrapper info"><el-icon><User /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.totalClasses }}</span>
              <span class="stat-name">班级</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-icon-wrapper purple"><el-icon><Briefcase /></el-icon></span>
            <div class="stat-text">
              <span class="stat-num">{{ stats.completedSubmissions }}</span>
              <span class="stat-name">已完成</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { getSystemStats } from '../../api/system'
import { 
  User, 
  Reading, 
  Document, 
  EditPen, 
  Briefcase, 
  Clock,
  ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const currentTime = ref('')
const loading = ref(false)

const stats = ref({
  totalUsers: 0,
  totalCourses: 0,
  totalAssignments: 0,
  totalSubmissions: 0,
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  pendingSubmissions: 0,
  completedSubmissions: 0
})

const studentPercentage = computed(() => {
  if (stats.value.totalUsers === 0) return 0
  return stats.value.totalStudents / stats.value.totalUsers
})

const teacherPercentage = computed(() => {
  if (stats.value.totalUsers === 0) return 0
  return stats.value.totalTeachers / stats.value.totalUsers
})

const adminPercentage = computed(() => {
  if (stats.value.totalUsers === 0) return 0
  return 1 - studentPercentage.value - teacherPercentage.value
})

const loadStats = async () => {
  loading.value = true
  try {
    const response = await getSystemStats()
    if (response.code === 200 && response.data) {
      stats.value = {
        totalUsers: response.data.total_users || response.data.totalUsers || 0,
        totalCourses: response.data.total_courses || response.data.totalCourses || 0,
        totalAssignments: response.data.total_assignments || response.data.totalAssignments || 0,
        totalSubmissions: response.data.total_submissions || response.data.totalSubmissions || 0,
        totalStudents: response.data.total_students || response.data.totalStudents || 0,
        totalTeachers: response.data.total_teachers || response.data.totalTeachers || 0,
        totalClasses: response.data.total_classes || response.data.totalClasses || 0,
        pendingSubmissions: response.data.pending_submissions || response.data.pendingSubmissions || 0,
        completedSubmissions: response.data.completed_submissions || response.data.completedSubmissions || 0
      }
    }
  } catch (error) {
    console.error('[Dashboard] 加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

let timer: number

onMounted(() => {
  updateTime()
  loadStats()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-dashboard-container {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-left h1 {
  color: var(--text-primary);
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.logout-btn {
  background-color: var(--danger-color);
  border-color: var(--danger-color);
  
  &:hover {
    background-color: var(--danger-light);
    border-color: var(--danger-light);
  }
}

.current-time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-family: monospace;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
  }
  
  &.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: #fff;
  }
  
  &.warning {
    background: linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%);
    color: #fff;
  }
  
  &.danger {
    background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
    color: #fff;
  }
  
  &.info {
    background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
    color: #fff;
  }
  
  &.purple {
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
    color: #fff;
  }
  
  &.cyan {
    background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
    color: #fff;
  }
  
  &.orange {
    background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
    color: #fff;
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.pie-chart-card {
  grid-column: span 1;
}

.stats-detail-card {
  grid-column: span 1;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg) 0;
}

.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    #667eea 0deg calc(var(--percentage-student, 0.7) * 360deg),
    #10b981 calc(var(--percentage-student, 0.7) * 360deg) calc(calc(var(--percentage-student, 0.7) + var(--percentage-teacher, 0.25)) * 360deg),
    #ef4444 calc(calc(var(--percentage-student, 0.7) + var(--percentage-teacher, 0.25)) * 360deg) 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.pie-center {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.pie-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 0 var(--spacing-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  
  &.student {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  &.teacher {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }
  
  &.admin {
    background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  }
}

.legend-label {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.legend-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--bg-hover);
  }
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.primary {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
  
  &.success {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
  
  &.warning {
    background: rgba(249, 115, 22, 0.1);
    color: #f97316;
  }
  
  &.danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  &.info {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  &.purple {
    background: rgba(168, 85, 247, 0.1);
    color: #a855f7;
  }
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.stat-name {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .pie-chart-card,
  .stats-detail-card {
    grid-column: span 1;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
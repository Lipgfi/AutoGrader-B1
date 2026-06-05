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
          <div class="stat-icon" style="background-color: var(--primary-bg);">
            <el-icon :size="28" style="color: var(--primary-color);"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">用户总数</span>
          </div>
        </div>
        <div class="stat-footer">
          <span :class="['trend', monthlyChanges.users >= 0 ? 'up' : 'down']">
            <el-icon><Top v-if="monthlyChanges.users >= 0" /><Bottom v-else /></el-icon>
            {{ monthlyChanges.users >= 0 ? '+' : '' }}{{ monthlyChanges.users }}%
          </span>
          <span class="period">较上月</span>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background-color: var(--success-bg);">
            <el-icon :size="28" style="color: var(--success-color);"><Reading /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalCourses }}</span>
            <span class="stat-label">课程总数</span>
          </div>
        </div>
        <div class="stat-footer">
          <span :class="['trend', monthlyChanges.courses >= 0 ? 'up' : 'down']">
            <el-icon><Top v-if="monthlyChanges.courses >= 0" /><Bottom v-else /></el-icon>
            {{ monthlyChanges.courses >= 0 ? '+' : '' }}{{ monthlyChanges.courses }}%
          </span>
          <span class="period">较上月</span>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background-color: var(--warning-bg);">
            <el-icon :size="28" style="color: var(--warning-color);"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalSubmissions }}</span>
            <span class="stat-label">提交总数</span>
          </div>
        </div>
        <div class="stat-footer">
          <span :class="['trend', monthlyChanges.submissions >= 0 ? 'up' : 'down']">
            <el-icon><Top v-if="monthlyChanges.submissions >= 0" /><Bottom v-else /></el-icon>
            {{ monthlyChanges.submissions >= 0 ? '+' : '' }}{{ monthlyChanges.submissions }}%
          </span>
          <span class="period">较上月</span>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon" style="background-color: var(--danger-bg);">
            <el-icon :size="28" style="color: var(--danger-color);"><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.avgScore }}</span>
            <span class="stat-label">平均分数</span>
          </div>
        </div>
        <div class="stat-footer">
          <span :class="['trend', monthlyChanges.avgScore >= 0 ? 'up' : 'down']">
            <el-icon><Top v-if="monthlyChanges.avgScore >= 0" /><Bottom v-else /></el-icon>
            {{ monthlyChanges.avgScore >= 0 ? '+' : '' }}{{ monthlyChanges.avgScore }}%
          </span>
          <span class="period">较上月</span>
        </div>
      </el-card>
    </div>
    
    <el-row :gutter="24">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>提交趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="week">近一周</el-radio-button>
                <el-radio-button label="month">近一月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div v-for="(item, index) in chartData" :key="index" class="chart-bar-item">
                  <div class="bar-wrapper">
                    <div class="bar" :style="{ height: item.value + '%' }"></div>
                  </div>
                  <span class="bar-label">{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="pie-chart-card">
          <template #header>
            <span>用户分布</span>
          </template>
          <div class="pie-chart-container">
            <div class="pie-chart">
              <div class="pie-segment student" style="--percentage: 0.7;"></div>
              <div class="pie-segment teacher" style="--percentage: 0.25;"></div>
              <div class="pie-segment admin" style="--percentage: 0.05;"></div>
              <div class="pie-center">
                <span class="pie-total">{{ stats.totalUsers }}</span>
                <span class="pie-label">总用户</span>
              </div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color student"></span>
                <span class="legend-label">学生</span>
                <span class="legend-value">70%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color teacher"></span>
                <span class="legend-label">教师</span>
                <span class="legend-value">25%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color admin"></span>
                <span class="legend-label">管理员</span>
                <span class="legend-value">5%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="24" style="margin-top: var(--spacing-lg);">
      <el-col :span="24">
        <el-card class="recent-card">
          <template #header>
            <div class="card-header">
              <span>提交概况</span>
            </div>
          </template>
          <div class="recent-list">
            <div class="recent-item">
              <div class="item-content">
                <div class="item-header">
                  <span class="item-name">提交总数</span>
                  <span class="item-value">{{ stats.totalSubmissions }}</span>
                </div>
              </div>
            </div>
            <div class="recent-item">
              <div class="item-content">
                <div class="item-header">
                  <span class="item-name">已完成评测</span>
                  <el-tag type="success" size="small">{{ stats.completedSubmissions }}</el-tag>
                </div>
              </div>
            </div>
            <div class="recent-item">
              <div class="item-content">
                <div class="item-header">
                  <span class="item-name">待评测</span>
                  <el-tag type="warning" size="small">{{ stats.pendingSubmissions }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
          </el-row>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { getSystemStats } from '../../api/system'
import { 
  User, 
  Reading, 
  Document, 
  TrendCharts, 
  Top,
  Bottom,
  ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const currentTime = ref('')
const chartPeriod = ref('week')
const loading = ref(false)

const stats = ref({
  totalUsers: 0,
  totalCourses: 0,
  totalSubmissions: 0,
  avgScore: 0,
  pendingSubmissions: 0,
  completedSubmissions: 0
})

const chartData = ref<{ label: string; value: number }[]>([])
const recentSubmissions = ref<any[]>([])
const monthlyChanges = ref({ users: 0, courses: 0, submissions: 0, avgScore: 0 })

// 加载统计数据
const loadStats = async () => {
  loading.value = true
  try {
    const response = await getSystemStats()
    if (response.code === 200 && response.data) {
      stats.value = {
        totalUsers: response.data.total_users || response.data.totalUsers || 0,
        totalCourses: response.data.total_courses || response.data.totalCourses || 0,
        totalSubmissions: response.data.total_submissions || response.data.totalSubmissions || 0,
        avgScore: response.data.avgScore || response.data.avg_score || 0,
        pendingSubmissions: response.data.pending_submissions || 0,
        completedSubmissions: response.data.completed_submissions || 0
      }
      // 月度变化
      const mc = response.data.monthlyChanges || {}
      monthlyChanges.value = {
        users: mc.users ?? 0,
        courses: mc.courses ?? 0,
        submissions: mc.submissions ?? 0,
        avgScore: mc.avgScore ?? 0
      }
      // 图表数据：优先用后端返回的，否则用提交状态分布生成
      if (response.data.chartData) {
        chartData.value = response.data.chartData
      } else {
        const pending = response.data.pending_submissions || 0
        const completed = response.data.completed_submissions || 0
        const total = response.data.total_submissions || 1
        chartData.value = [
          { label: '已完成', value: Math.round(completed / total * 100) },
          { label: '待评测', value: Math.round(pending / total * 100) }
        ]
      }
      // 最近提交
      if (response.data.recentSubmissions) {
        recentSubmissions.value = response.data.recentSubmissions.map((s: any) => ({
          id: s.id,
          name: s.student_name || '',
          time: s.time || '',
          course: s.course_name || '',
          assignment: s.assignment_title || '',
          score: s.score ?? 0
        }))
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

.header-desc {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.current-time {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-family: var(--font-family-code);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  border: 1px solid var(--border-light);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-light);
}

.trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.trend.up {
  color: var(--success-color);
}

.trend.down {
  color: var(--danger-color);
}

.period {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.chart-card,
.pie-chart-card,
.recent-card {
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: var(--spacing-md);
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  height: 100%;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.bar-wrapper {
  width: 40px;
  height: 200px;
  background-color: var(--bg-tertiary);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-light) 100%);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  transition: height var(--transition-normal);
}

.bar-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
}

.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary-color) 0deg calc(0.7 * 360deg),
    var(--success-color) calc(0.7 * 360deg) calc(0.95 * 360deg),
    var(--warning-color) calc(0.95 * 360deg) 360deg
  );
  position: relative;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background-color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-total {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.pie-label {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-full);
}

.legend-color.student { background-color: var(--primary-color); }
.legend-color.teacher { background-color: var(--success-color); }
.legend-color.admin { background-color: var(--warning-color); }

.legend-label {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.legend-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.recent-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-fast);
}

.recent-item:hover {
  background-color: var(--bg-secondary);
}

.item-content {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.item-time {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.item-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

@media (max-width: 1200px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: var(--spacing-md);
  }
  
  .page-header {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
}

</style>

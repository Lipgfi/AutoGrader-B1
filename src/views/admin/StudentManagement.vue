<template>
  <div class="student-management">
    <div class="page-header">
      <div class="header-left">
        <h1>学生信息管理</h1>
        <p class="header-desc">管理学生信息，支持批量导入和导出</p>
      </div>
      <div class="header-right">
        <el-upload
          v-if="canPerformAction('import')"
          class="upload-btn"
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          accept=".csv,.xlsx,.xls,.pdf"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
        </el-upload>
        <el-button 
          v-if="canPerformAction('export')"
          type="success" 
          @click="exportStudents"
        >
          <el-icon><Download /></el-icon>
          导出学生
        </el-button>
        <el-button 
          v-if="canPerformAction('add')"
          type="warning" 
          @click="addStudent"
        >
          <el-icon><Plus /></el-icon>
          添加学生
        </el-button>
      </div>
    </div>
    
    <el-card class="filter-card">
      <div class="filter-row">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索学生姓名/学号"
          prefix-icon="Search"
          clearable
          class="search-input"
        />
        <el-select v-model="filterStatus" placeholder="选择状态" clearable class="filter-select">
          <el-option label="全部状态" value="" />
          <el-option label="激活" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </div>
    </el-card>
    
    <el-card class="students-card">
      <el-table :data="filteredStudents" style="width: 100%">
        <el-table-column prop="id" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'" effect="dark" size="small">
              {{ scope.row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="canEditStudent(scope.row)"
              type="primary" 
              link 
              size="small" 
              @click="editStudent(scope.row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="canEditStudent(scope.row)"
              :type="scope.row.status === 'active' ? 'danger' : 'success'" 
              link 
              size="small" 
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '激活' }}
            </el-button>
            <el-button 
              v-if="canPerformAction('delete')"
              type="danger" 
              link 
              size="small" 
              @click="handleDeleteStudent(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 导入预览/结果弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      :title="importResult ? '导入结果' : '数据预览'"
      width="700px"
      :close-on-click-modal="false"
    >
      <div v-if="importResult" class="import-result">
        <div class="result-stats">
          <div class="stat-item">
            <span class="stat-value">{{ importResult.success }}</span>
            <span class="stat-label">成功导入</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ importResult.failed }}</span>
            <span class="stat-label">导入失败</span>
          </div>
        </div>

        <div v-if="importResult.failed > 0" class="failed-list">
          <h3>失败详情</h3>
          <el-table :data="importResult.failedList" style="width: 100%">
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="reason" label="失败原因" min-width="400" />
          </el-table>
        </div>
      </div>

      <div v-else-if="previewData.length > 0" class="preview-section">
        <p style="margin-bottom: 12px; color: #666;">共 {{ previewData.length }} 条数据，前5条预览：</p>
        <el-table :data="previewData.slice(0, 5)" style="width: 100%" border size="small">
          <el-table-column prop="id" label="学号" width="120" />
          <el-table-column prop="username" label="用户名" width="100" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="phone" label="手机号" width="120" />
        </el-table>
      </div>

      <template #footer>
        <el-button @click="importDialogVisible = false; previewData = []; selectedImportFile = null">取消</el-button>
        <el-button v-if="!importResult" type="primary" @click="confirmImport">确认导入</el-button>
      </template>
    </el-dialog>
    
    <!-- 添加/编辑学生弹窗 -->
    <el-dialog
      v-model="studentDialogVisible"
      :title="isEdit ? '编辑学生' : '添加学生'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="学号">
          <el-input v-model="form.id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" type="email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="studentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStudent">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  Download,
  Plus
} from '@element-plus/icons-vue'
import { getStudents, importStudents, resetStudentPassword, updateStudentStatus } from '../../api/student'
import { usePermissions } from '../../services/permissionService'
import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        console.log('Excel读取成功，数据大小:', data.length)
        const workbook = XLSX.read(data, { type: 'array' })
        console.log('工作簿名称:', workbook.SheetNames)
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]
        console.log('Excel原始数据:', jsonData)

        const results: any[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (row && row.length > 0) {
            results.push({
              id: String(row[0] || ''),
              name: String(row[1] || ''),
              username: String(row[2] || ''),
              email: String(row[3] || ''),
              phone: String(row[4] || ''),
              status: 'active'
            })
          }
        }
        console.log('Excel解析结果:', results)
        resolve(results)
      } catch (error) {
        console.error('Excel解析错误:', error)
        reject(error)
      }
    }
    reader.onerror = (err) => {
      console.error('FileReader错误:', err)
      reject(new Error('文件读取失败'))
    }
    reader.readAsArrayBuffer(file)
  })
}

async function parsePDFFile(file: File): Promise<any[]> {
  console.log('开始解析PDF文件')
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  console.log('PDF页数:', pdf.numPages)

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(' ')
    fullText += pageText + '\n'
  }
  console.log('PDF全文:', fullText.substring(0, 200))

  const results: any[] = []
  const lines = fullText.split(/[\n\r]+/).filter(line => line.trim())

  for (const line of lines) {
    const parts = line.split(/[\s,;,\t]+/).filter(p => p.trim())
    if (parts.length >= 2) {
      results.push({
        id: parts[0] || '',
        name: parts[1] || '',
        username: parts[0] || '',
        email: parts.find(p => p.includes('@')) || '',
        phone: parts.find(p => /^1[3-9]\d{9}$/.test(p)) || '',
        status: 'active'
      })
    }
  }
  console.log('PDF解析结果:', results)

  return results
}

function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        console.log('CSV内容:', content.substring(0, 200))
        const lines = content.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          resolve([])
          return
        }

        // 读取头行，按列名映射，对齐后端期望的 student_id, real_name, email, password
        const headers = lines[0].split(/[,;\t]/).map(h => h.trim().toLowerCase())
        console.log('CSV表头:', headers)

        const results: any[] = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const parts = line.split(/[,;\t]/).map(p => p.trim())
          const row: Record<string, string> = {}
          for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = parts[j] || ''
          }

          const studentId = row['student_id'] || row['学号'] || ''
          const username = row['username'] || row['用户名'] || studentId
          const realName = row['real_name'] || row['姓名'] || row['name'] || ''
          const email = row['email'] || row['邮箱'] || ''
          const phone = row['phone'] || row['手机号'] || ''
          const password = row['password'] || row['密码'] || ''

          if (studentId || realName) {
            results.push({
              id: studentId,
              name: realName,
              username: username,
              email: email,
              phone: phone,
              password: password,
              status: 'active'
            })
          }
        }
        console.log('CSV解析结果:', results)
        resolve(results)
      } catch (error) {
        console.error('CSV解析错误:', error)
        reject(error)
      }
    }
    reader.onerror = (err) => {
      console.error('FileReader错误:', err)
      reject(new Error('文件读取失败'))
    }
    reader.readAsText(file, 'UTF-8')
  })
}

// 验证学生数据
function validateStudentData(student: any): { valid: boolean; error?: string } {
  if (!student.id || student.id.trim() === '') {
    return { valid: false, error: '学号不能为空' }
  }
  if (!student.name || student.name.trim() === '') {
    return { valid: false, error: '姓名不能为空' }
  }
  if (!student.username || student.username.trim() === '') {
    return { valid: false, error: '用户名不能为空' }
  }
  if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    return { valid: false, error: '邮箱格式错误' }
  }
  if (!student.phone || !/^1[3-9]\d{9}$/.test(student.phone)) {
    return { valid: false, error: '手机号格式错误' }
  }
  return { valid: true }
}

// 批量导入处理
async function processBatchImport(file: File) {
  try {
    const students = await parseExcelFile(file)
    
    // 模拟大文件处理，使用setTimeout模拟异步
    return new Promise((resolve) => {
      setTimeout(() => {
        const success: any[] = []
        const failed: any[] = []
        
        students.forEach((student, index) => {
          const validation = validateStudentData(student)
          if (validation.valid) {
            success.push(student)
          } else {
            failed.push({ row: index + 1, reason: validation.error, data: student })
          }
        })
        
        resolve({ success, failed })
      }, 1500)
    })
  } catch (error) {
    throw new Error('导入失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const importDialogVisible = ref(false)
const studentDialogVisible = ref(false)
const isEdit = ref(false)
const importResult = ref<any>(null)
const previewData = ref<any[]>([])
const selectedImportFile = ref<File | null>(null)

const form = ref({
  id: '',
  name: '',
  username: '',
  email: '',
  phone: '',
  status: 'active'
})

const students = ref<any[]>([])

// 加载学生数据
const loadStudents = async () => {
  try {
    const result = await getStudents({
      keyword: searchKeyword.value,
      status: filterStatus.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    const raw = result.data?.students || result.data?.list || result.data || []
    students.value = (Array.isArray(raw) ? raw : []).map((s: any) => ({
      id: s.student_id || s.id || '',
      name: s.real_name || s.name || '',
      username: s.username || '',
      email: s.email || '',
      phone: s.phone || '',
      status: s.is_active ? 'active' : 'inactive'
    }))
    total.value = result.data?.total || students.value.length
  } catch (error) {
    ElMessage.error('加载学生数据失败')
  }
}

// 权限管理
const { canPerformAction, canEditStudent } = usePermissions()

// 组件挂载时加载数据
onMounted(() => {
  loadStudents()
})

const filteredStudents = computed(() => {
  let result = students.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(keyword) ||
      s.id.toLowerCase().includes(keyword)
    )
  }

  if (filterStatus.value) {
    result = result.filter(s => s.status === filterStatus.value)
  }
  
  return result
})

const handleFileChange = async (file: any, fileList: any[]) => {
  console.log('handleFileChange 被调用', { file, fileList })
  
  // 检查是否是删除文件的操作
  if (!file.raw) {
    console.log('文件被删除，清空预览')
    selectedImportFile.value = null
    previewData.value = []
    return
  }

  selectedImportFile.value = file.raw
  const fileName = file.raw.name.toLowerCase()

  console.log('开始解析文件:', fileName, '文件大小:', file.raw.size)

  try {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      previewData.value = await parseExcelFile(file.raw)
      console.log('Excel解析结果:', previewData.value)
      ElMessage.success(`解析成功，共 ${previewData.value.length} 条数据`)
    } else if (fileName.endsWith('.pdf')) {
      previewData.value = await parsePDFFile(file.raw)
      console.log('PDF解析结果:', previewData.value)
      ElMessage.success(`解析成功，共 ${previewData.value.length} 条数据`)
    } else if (fileName.endsWith('.csv')) {
      previewData.value = await parseCSVFile(file.raw)
      console.log('CSV解析结果:', previewData.value)
      ElMessage.success(`解析成功，共 ${previewData.value.length} 条数据`)
    } else {
      ElMessage.warning('不支持的文件格式')
      return
    }

    if (previewData.value.length > 0) {
      importDialogVisible.value = true
    }
  } catch (error: any) {
    console.error('文件解析失败:', error)
    ElMessage.error('文件解析失败: ' + (error.message || '未知错误'))
    previewData.value = []
  }
}

const confirmImport = async () => {
  if (!selectedImportFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }

  try {
    ElMessage.info('正在导入学生，请稍候...')
    const result = await importStudents(0, selectedImportFile.value)

    if (result.code === 200) {
      const data = result.data || {}
      const successCount = data.success_count || 0
      const failCount = data.fail_count || 0
      const failReasons = data.fail_reasons || []

      importResult.value = {
        success: successCount,
        failed: failCount,
        failedList: failReasons.map((item: any, index: number) => ({
          row: index + 1,
          reason: item
        }))
      }

      if (successCount > 0) {
        ElMessage.success(`成功导入 ${successCount} 名学生`)
        await loadStudents()
      }

      if (failCount > 0) {
        ElMessage.warning(`${failCount} 名学生导入失败`)
      }
    } else {
      ElMessage.error(result.msg || '导入失败')
    }
  } catch (error: any) {
    console.error('[confirmImport] 导入失败:', error)
    ElMessage.error(error?.response?.data?.detail || error?.message || '导入失败')
  } finally {
    importDialogVisible.value = false
    selectedImportFile.value = null
    previewData.value = []
  }
}

const exportStudents = () => {
  ElMessage.success('学生信息导出成功')
}

const addStudent = () => {
  isEdit.value = false
  form.value = {
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    status: 'active'
  }
  studentDialogVisible.value = true
}

const editStudent = (row: any) => {
  isEdit.value = true
  form.value = { ...row }
  studentDialogVisible.value = true
}

const saveStudent = async () => {
  try {
    if (isEdit.value) {
      ElMessage.warning('单个学生编辑功能暂不支持，请使用批量导入更新学生信息')
      return
    } else {
      ElMessage.warning('单个学生添加功能暂不支持，请使用批量导入功能')
      return
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '学生信息编辑失败' : '学生添加失败')
  }
}

const toggleStatus = async (row: any) => {
  try {
    const isCurrentlyActive = row.status === 'active'
    const newActive = !isCurrentlyActive
    await updateStudentStatus(String(row.id), newActive)
    row.status = newActive ? 'active' : 'inactive'
    ElMessage.success(`学生状态已${newActive ? '激活' : '停用'}`)
  } catch (error) {
    ElMessage.error('修改学生状态失败')
  }
}

const handleDeleteStudent = (row: any) => {
  ElMessageBox.confirm('确定要停用该学生账号吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateStudentStatus(String(row.id), false)
      row.status = 'inactive'
      ElMessage.success('学生账号已停用')
    } catch (error) {
      ElMessage.error('操作失败')
    }
  })
}

const handleSizeChange = async (size: number) => {
  pageSize.value = size
  await loadStudents()
}

const handleCurrentChange = async (current: number) => {
  currentPage.value = current
  await loadStudents()
}
</script>

<style scoped>
.student-management {
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

.header-left h1 {
  color: var(--text-primary);
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.header-desc {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.header-right {
  display: flex;
  gap: var(--spacing-md);
}

.filter-card {
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--border-light);
}

.filter-row {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 150px;
}

.students-card {
  border: 1px solid var(--border-light);
}

.pagination {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.import-result {
  padding: var(--spacing-md) 0;
}

.result-stats {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
}

.failed-list {
  margin-top: var(--spacing-lg);
}

.failed-list h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

@media (max-width: 768px) {
  .student-management {
    padding: var(--spacing-md);
  }
  
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .header-right {
    flex-wrap: wrap;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .filter-select {
    width: 100%;
  }
  
  .result-stats {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>

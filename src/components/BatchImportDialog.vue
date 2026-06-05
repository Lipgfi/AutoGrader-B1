<template>
  <el-dialog
    :model-value="visible"
    :title="importResult ? '导入结果' : '批量导入'"
    width="700px"
    :close-on-click-modal="false"
    @update:model-value="$emit('update:visible', $event)"
  >
    <!-- 步骤1: 选择文件和预览 -->
    <div v-if="!importResult">
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          drag
          :auto-upload="false"
          :on-change="handleFileChange"
          :accept="acceptedFormats"
          :limit="1"
          :on-exceed="() => ElMessage.warning('一次只能上传一个文件')"
        >
          <el-icon :size="48"><UploadFilled /></el-icon>
          <div class="upload-text">
            <p>将文件拖到此处或<em>点击上传</em></p>
            <p class="upload-hint">支持 {{ acceptedFormats }} 格式</p>
          </div>
        </el-upload>
        <div class="upload-actions">
          <el-button type="primary" link @click="downloadTemplate">
            <el-icon><Download /></el-icon>下载导入模板
          </el-button>
        </div>
      </div>

      <!-- 数据预览 -->
      <div v-if="previewData.length > 0" class="preview-section">
        <el-alert
          :title="`已识别 ${previewData.length} 条数据，显示前 ${Math.min(5, previewData.length)} 条`"
          type="info"
          :closable="false"
          show-icon
        />
        <el-table :data="previewData.slice(0, 5)" style="width: 100%; margin-top: 12px" border size="small">
          <el-table-column
            v-for="col in previewColumns"
            :key="col"
            :prop="col"
            :label="col"
          />
        </el-table>
      </div>

      <!-- 无数据提示 -->
      <div v-else-if="selectedFile" class="preview-section">
        <el-alert title="未能从文件中识别到数据，请检查文件格式" type="warning" :closable="false" show-icon />
      </div>
    </div>

    <!-- 步骤2: 导入结果 -->
    <div v-else class="import-result">
      <el-result
        :icon="importResult.failed === 0 ? 'success' : 'warning'"
        :title="importResult.failed === 0 ? '导入完成' : '导入完成（部分失败）'"
      >
        <template #sub-title>
          <div class="result-stats">
            <el-statistic title="成功导入" :value="importResult.success">
              <template #suffix>
                <el-icon color="var(--success-color)"><SuccessFilled /></el-icon>
              </template>
            </el-statistic>
            <el-statistic title="导入失败" :value="importResult.failed" v-if="importResult.failed > 0">
              <template #suffix>
                <el-icon color="var(--danger-color)"><WarningFilled /></el-icon>
              </template>
            </el-statistic>
          </div>
        </template>
      </el-result>

      <div v-if="importResult.failedList && importResult.failedList.length > 0" class="failed-list">
        <el-divider />
        <h4>失败详情</h4>
        <el-table :data="importResult.failedList" style="width: 100%" max-height="240" size="small">
          <el-table-column prop="row" label="行号" width="80" />
          <el-table-column prop="reason" label="失败原因" min-width="300" show-overflow-tooltip />
        </el-table>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">{{ importResult ? '关闭' : '取消' }}</el-button>
        <el-button
          v-if="!importResult && previewData.length > 0"
          type="primary"
          :loading="importing"
          @click="handleImport"
        >
          {{ importing ? '导入中...' : `确认导入 (${previewData.length} 条)` }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

interface ImportResult {
  success: number
  failed: number
  failedList: { row: number; reason: string }[]
}

const props = withDefaults(defineProps<{
  visible: boolean
  acceptedFormats?: string
  templateData?: { headers: string[]; rows?: any[][] }
  importApi?: (file: File) => Promise<any>
}>(), {
  acceptedFormats: '.csv,.xlsx,.xls',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const uploadRef = ref()
const selectedFile = ref<File | null>(null)
const previewData = ref<any[]>([])
const previewColumns = ref<string[]>([])
const importResult = ref<ImportResult | null>(null)
const importing = ref(false)

const supportedTypes = [
  { ext: '.csv', mime: 'text/csv' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { ext: '.xls', mime: 'application/vnd.ms-excel' },
]

function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const lines = content.split('\n').filter(line => line.trim())
        if (lines.length < 2) { resolve([]); return }

        const headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/"/g, ''))
        const rows: any[] = []
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(/[,;\t]/).map(p => p.trim().replace(/"/g, ''))
          if (parts.length < headers.length) continue
          const row: any = {}
          headers.forEach((h, idx) => { row[h] = parts[idx] || '' })
          rows.push(row)
        }
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]
        if (jsonData.length < 2) { resolve([]); return }

        const headers = jsonData[0].map(h => String(h ?? '').trim())
        const rows: any[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row || row.every(cell => !cell)) continue
          const obj: any = {}
          headers.forEach((h, idx) => { obj[h] = row[idx] != null ? String(row[idx]).trim() : '' })
          rows.push(obj)
        }
        resolve(rows)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

async function handleFileChange(file: any) {
  importResult.value = null
  previewData.value = []

  if (!file.raw) return

  selectedFile.value = file.raw
  const fileName = file.raw.name.toLowerCase()

  try {
    let data: any[] = []
    if (fileName.endsWith('.csv')) {
      data = await parseCSV(file.raw)
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      data = await parseExcel(file.raw)
    } else {
      ElMessage.warning('不支持的文件格式')
      return
    }

    previewData.value = data
    if (data.length > 0) {
      previewColumns.value = Object.keys(data[0])
    }
  } catch (error: any) {
    ElMessage.error('文件解析失败: ' + (error.message || '未知错误'))
  }
}

async function handleImport() {
  if (!selectedFile.value || !props.importApi) return

  importing.value = true
  try {
    const result = await props.importApi(selectedFile.value)

    if (result.code === 200) {
      const data = result.data || {}
      const successCount = data.success_count || 0
      const failCount = data.fail_count || 0
      const failReasons: string[] = data.fail_reasons || []

      importResult.value = {
        success: successCount,
        failed: failCount,
        failedList: failReasons.map((item: string, index: number) => ({
          row: index + 1,
          reason: item
        }))
      }

      if (successCount > 0) {
        ElMessage.success(`成功导入 ${successCount} 条`)
        emit('success')
      }
      if (failCount > 0) {
        ElMessage.warning(`${failCount} 条导入失败`)
      }
    } else {
      ElMessage.error(result.msg || '导入失败')
    }
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.detail || error?.message || '导入失败')
  } finally {
    importing.value = false
  }
}

function handleClose() {
  if (importResult.value) {
    importResult.value = null
    selectedFile.value = null
    previewData.value = []
    previewColumns.value = []
  }
  emit('update:visible', false)
}

function downloadTemplate() {
  const headers = props.templateData?.headers || ['student_id', 'real_name', 'email', 'password']
  const rows = props.templateData?.rows || [['2024001', '张三', 'zhangsan@example.com', '']]

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')

  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'import_template.csv'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('模板下载成功')
}
</script>

<style scoped>
.upload-area {
  text-align: center;
}

.upload-text {
  margin-top: 8px;
}

.upload-text em {
  color: var(--primary-color);
  font-style: normal;
}

.upload-hint {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  margin-top: 4px;
}

.upload-actions {
  margin-top: 12px;
}

.preview-section {
  margin-top: 16px;
}

.import-result {
  text-align: center;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 8px;
}

.failed-list {
  margin-top: 12px;
  text-align: left;
}

.failed-list h4 {
  margin: 0 0 8px 0;
  font-weight: var(--font-weight-medium);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>

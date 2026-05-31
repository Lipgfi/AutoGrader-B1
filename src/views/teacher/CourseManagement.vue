<template>
  <div class="course-management-container">
    <div class="page-header">
      <div class="header-left">
        <h1>{{ pageTitle }}</h1>
        <p class="header-desc">{{ pageDescription }}</p>
      </div>
      <div class="header-right">
        <el-button v-if="!isClassPage" type="primary" @click="showCreateCourseDialog">
          <el-icon><Plus /></el-icon>
          新建课程
        </el-button>
        <el-button v-else type="primary" @click="showCreateClassDialog" :disabled="!selectedCourseId">
          <el-icon><Plus /></el-icon>
          新建班级
        </el-button>
        <el-button
          icon="ArrowRight"
          @click="handleLogout"
          class="logout-btn"
        >
          退出登录
        </el-button>
      </div>
    </div>

    <div v-if="!isClassPage" class="management-section courses-section">
          <div class="section-header">
            <el-input
              v-model="courseSearch"
              placeholder="搜索课程名称或编号"
              prefix-icon="Search"
              clearable
              class="search-input"
            />
            <el-select v-model="courseStatusFilter" placeholder="课程状态" clearable>
              <el-option label="全部状态" value="" />
              <el-option label="进行中" value="active" />
              <el-option label="已结束" value="ended" />
            </el-select>
          </div>

          <div class="courses-grid">
            <el-card
              v-for="course in filteredCourses"
              :key="course.id"
              class="course-card"
            >
              <div class="course-header">
                <div class="course-color" :style="{ backgroundColor: course.color }"></div>
                <div class="course-info">
                  <h3>{{ course.name }}</h3>
                  <p class="course-code">{{ course.code }}</p>
                </div>
                <el-dropdown trigger="click" @command="handleCourseCommand">
                  <el-button link>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{ action: 'edit', course }">编辑课程</el-dropdown-item>
                      <el-dropdown-item :command="{ action: 'classes', course }">管理班级</el-dropdown-item>
                      <el-dropdown-item :command="{ action: 'delete', course }" divided>删除课程</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>

              <div class="course-stats">
                <div class="stat-item">
                  <el-icon><User /></el-icon>
                  <span>{{ course.classCount }} 个班级</span>
                </div>
                <div class="stat-item">
                  <el-icon><Document /></el-icon>
                  <span>{{ course.assignmentCount }} 份作业</span>
                </div>
                <div class="stat-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ course.semester }}</span>
                </div>
              </div>

              <div class="course-classes">
                <span class="classes-label">班级：</span>
                <el-tag
                  v-for="cls in course.classes.slice(0, 3)"
                  :key="cls.id"
                  size="small"
                  effect="plain"
                >
                  {{ cls.name }}
                </el-tag>
                <el-tag v-if="course.classes.length > 3" size="small" type="info">
                  +{{ course.classes.length - 3 }}
                </el-tag>
              </div>

              <div class="course-footer">
                <el-tag :type="course.status === 'active' ? 'success' : 'info'" effect="dark" size="small">
                  {{ course.status === 'active' ? '进行中' : '已结束' }}
                </el-tag>
                <el-button type="primary" link size="small" @click="manageClasses(course)">
                  管理班级
                </el-button>
              </div>
            </el-card>
          </div>
    </div>

    <div v-else class="management-section classes-section">
          <div class="section-header">
            <el-select v-model="selectedCourseId" placeholder="选择课程" clearable @change="handleCourseSelect">
              <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
              />
            </el-select>
            <el-input
              v-model="classSearch"
              placeholder="搜索班级名称"
              prefix-icon="Search"
              clearable
              class="search-input"
            />
            <el-button type="primary" @click="showCreateClassDialog" :disabled="!selectedCourseId">
              <el-icon><Plus /></el-icon>
              新建班级
            </el-button>
          </div>

          <el-card class="classes-table-card">
            <el-table :data="filteredClasses" style="width: 100%">
              <el-table-column prop="name" label="班级名称" width="180" />
              <el-table-column prop="courseName" label="所属课程" width="180" />
              <el-table-column prop="studentCount" label="学生人数" width="120" align="center">
                <template #default="scope">
                  <el-tag type="info" effect="plain">{{ scope.row.studentCount }} 人</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="class_code" label="班级编号" width="120" />
              <el-table-column prop="createTime" label="创建时间" width="160" />
              <el-table-column label="操作" width="280" fixed="right">
                <template #default="scope">
                  <el-button type="primary" link size="small" @click="viewStudents(scope.row)">
                    查看学生
                  </el-button>
                  <el-button type="primary" link size="small" @click="importStudents(scope.row)">
                    导入学生
                  </el-button>
                  <el-button type="primary" link size="small" @click="showAddStudentDialog(scope.row)">
                    添加学生
                  </el-button>
                  <el-button type="primary" link size="small" @click="editClass(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="danger" link size="small" @click="deleteClass(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
    </div>

    <el-dialog
      v-model="courseDialogVisible"
      :title="editingCourse ? '编辑课程' : '新建课程'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="courseFormRef"
        :model="courseForm"
        :rules="courseRules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="课程编号" prop="code">
          <el-input v-model="courseForm.code" placeholder="请输入课程编号" />
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="courseForm.semester" placeholder="请选择学期" style="width: 100%">
            <el-option label="2026春季学期" value="2026春季学期" />
            <el-option label="2025秋季学期" value="2025秋季学期" />
            <el-option label="2025春季学期" value="2025春季学期" />
          </el-select>
        </el-form-item>
        <el-form-item label="课程描述" prop="description">
          <el-input
            v-model="courseForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入课程描述"
          />
        </el-form-item>
        <el-form-item label="课程颜色" prop="color">
          <div class="color-picker">
            <div
              v-for="color in colorOptions"
              :key="color"
              class="color-option"
              :style="{ backgroundColor: color }"
              :class="{ active: courseForm.color === color }"
              @click="courseForm.color = color"
            ></div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="classDialogVisible"
      :title="editingClass ? '编辑班级' : '新建班级'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="classFormRef"
        :model="classForm"
        :rules="classRules"
        label-width="100px"
      >
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="所属课程" prop="courseId">
          <el-select v-model="classForm.courseId" placeholder="请选择课程" style="width: 100%" :disabled="!!editingClass">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级编号" prop="classCode">
          <el-input v-model="classForm.classCode" placeholder="请输入班级编号，如 01" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="classDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveClass">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="importDialogVisible"
      title="导入学生"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          style="margin-bottom: var(--spacing-lg);"
        >
          <p>支持上传 CSV、Excel (.xlsx/.xls) 或 PDF 格式文件</p>
          <p>文件需包含：学号、姓名、邮箱、手机号（可选）、密码（可选）</p>
        </el-alert>

        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          :limit="1"
          accept=".csv,.xlsx,.xls,.pdf"
          @change="handleFileChange"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 CSV、Excel (.xlsx/.xls)、PDF 文件，且不超过 5MB
            </div>
          </template>
        </el-upload>

        <div v-if="previewData.length > 0" class="preview-section">
          <h4>数据预览（前5条）</h4>
          <el-table :data="previewData.slice(0, 5)" style="width: 100%">
            <el-table-column prop="studentId" label="学号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phone" label="手机号" width="120" />
          </el-table>
          <p class="preview-count">共 {{ previewData.length }} 条数据</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImport" :disabled="!selectedImportFile">
          确认导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 添加学生对话框 -->
    <el-dialog
      v-model="addStudentDialogVisible"
      title="添加学生"
      width="500px"
    >
      <div style="margin-bottom: 16px;">
        <el-input
          v-model="addStudentId"
          placeholder="输入学号搜索"
          clearable
          @keyup.enter="searchStudent"
        >
          <template #append>
            <el-button @click="searchStudent" :loading="searchingStudent">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </template>
        </el-input>
      </div>
      <div v-if="foundStudent" class="search-result">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="学号">{{ foundStudent.student_id }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ foundStudent.real_name }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ foundStudent.email }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="foundStudent.is_active ? 'success' : 'danger'" size="small">
              {{ foundStudent.is_active ? '正常' : '已禁用' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div style="margin-top: 16px; text-align: center;">
          <el-button type="primary" @click="confirmAddStudent" :loading="addingStudent">
            添加到当前班级
          </el-button>
        </div>
      </div>
      <div v-if="searchDone && !foundStudent" style="text-align: center; color: #999; padding: 20px;">
        未找到该学号的学生
      </div>
      <template #footer>
        <el-button @click="addStudentDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="studentsDialogVisible"
      :title="`学生列表 - ${selectedClass?.name || ''}`"
      width="800px"
    >
      <div class="students-content">
        <div class="students-header">
          <el-input
            v-model="studentSearch"
            placeholder="搜索学生"
            prefix-icon="Search"
            clearable
            class="search-input"
          />
        </div>
        <el-table :data="filteredStudents" style="width: 100%">
          <el-table-column prop="studentId" label="学号" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="joinedAt" label="加入时间" width="170" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/course'
import { getAssignments } from '../../api/assignment'
import { getClasses, createClass, updateClass, getClassStudents, deleteClass as deleteClassApi, addStudentToClass } from '../../api/class'
import { getStudents, importStudents as importStudentsApi } from '../../api/student'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  MoreFilled,
  User,
  Document,
  Calendar,
  UploadFilled
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import * as XLSX from 'xlsx'
import * as pdfjsLib from 'pdfjs-dist'

// ============================================
// 修复1: PDF.js Worker 路径 - 使用本地 worker 替代 CDN
// ============================================
// 方案：从 node_modules 复制 pdf.worker.min.mjs 到 public/ 目录
// 命令: cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isClassPage = computed(() => route.path === '/teacher/classes')
const pageTitle = computed(() => isClassPage.value ? '班级管理' : '课程管理')
const pageDescription = computed(() => isClassPage.value ? '新建班级、导入学生并维护班级名单' : '管理课程基础信息和课程概览')
const courseSearch = ref('')
const courseStatusFilter = ref('')
const selectedCourseId = ref('')
const classSearch = ref('')
const courseDialogVisible = ref(false)
const classDialogVisible = ref(false)
const importDialogVisible = ref(false)
const studentsDialogVisible = ref(false)
const addStudentDialogVisible = ref(false)
const addStudentId = ref('')
const foundStudent = ref<any>(null)
const searchingStudent = ref(false)
const addingStudent = ref(false)
const searchDone = ref(false)
const editingCourse = ref<any>(null)
const editingClass = ref<any>(null)
const selectedClass = ref<any>(null)
const studentSearch = ref('')
const previewData = ref<any[]>([])
const selectedImportFile = ref<File | null>(null)

const courseFormRef = ref<FormInstance>()
const classFormRef = ref<FormInstance>()

const colorOptions = ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F', '#722ED1', '#13C2C2']

const courseForm = reactive({
  name: '',
  code: '',
  semester: '2026春季学期',
  description: '',
  color: '#165DFF'
})

const classForm = reactive({
  name: '',
  classCode: '',
  courseId: ''
})

const courseRules: FormRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入课程编号', trigger: 'blur' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }]
}

const classRules: FormRules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  classCode: [{ required: true, message: '请输入班级编号', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

const courses = ref<any[]>([])

const classes = ref<any[]>([])

const students = ref<any[]>([])

const filteredCourses = computed(() => {
  let result = courses.value

  if (courseSearch.value) {
    const keyword = courseSearch.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(keyword) ||
      c.code.toLowerCase().includes(keyword)
    )
  }

  if (courseStatusFilter.value) {
    result = result.filter(c => c.status === courseStatusFilter.value)
  }

  return result
})

const filteredClasses = computed(() => {
  let result = classes.value

  if (selectedCourseId.value) {
    result = result.filter(c => String(c.courseId) === String(selectedCourseId.value))
  }

  if (classSearch.value) {
    const keyword = classSearch.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(keyword))
  }

  return result
})

const filteredStudents = computed(() => {
  if (!studentSearch.value) return students.value

  const keyword = studentSearch.value.toLowerCase()
  return students.value.filter(s => 
    s.studentId.toLowerCase().includes(keyword) ||
    s.name.toLowerCase().includes(keyword)
  )
})

const showCreateCourseDialog = () => {
  editingCourse.value = null
  Object.assign(courseForm, {
    name: '',
    code: '',
    semester: '2026春季学期',
    description: '',
    color: '#165DFF'
  })
  courseDialogVisible.value = true
}

const handleCourseCommand = (command: any) => {
  const { action, course } = command
  switch (action) {
    case 'edit':
      editingCourse.value = course
      Object.assign(courseForm, {
        name: course.name,
        code: course.code,
        semester: course.semester,
        description: course.description || '',
        color: course.color
      })
      courseDialogVisible.value = true
      break
    case 'classes':
      manageClasses(course)
      break
    case 'delete':
      ElMessageBox.confirm(`确定要删除课程"${course.name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteCourse(String(course.id))
          await loadCourses()
          ElMessage.success('删除成功')
        } catch (e) {
          ElMessage.error('删除失败')
        }
      })
      break
  }
}

const saveCourse = async () => {
  if (!courseFormRef.value) return

  try {
    await courseFormRef.value.validate()

    if (editingCourse.value) {
      try {
        await updateCourse(String(editingCourse.value.id), {
          courseName: courseForm.name,
          courseCode: courseForm.code,
          semester: courseForm.semester,
          description: courseForm.description
        })
        await loadCourses()
        ElMessage.success('课程更新成功')
      } catch (e) {
        ElMessage.error('课程更新失败')
      }
    } else {
      // 调用API创建课程
      const response = await createCourse({
        courseName: courseForm.name,
        courseCode: courseForm.code,
        semester: courseForm.semester,
        description: courseForm.description
      })

      if (response.code === 200 && response.data) {
        ElMessage.success('课程创建成功')
        // 刷新课程列表
        await loadCourses()
      } else {
        ElMessage.error('课程创建失败')
      }
    }

    courseDialogVisible.value = false
  } catch (error) {
    console.error('课程保存失败', error)
    ElMessage.error('课程保存失败')
  }
}

// 加载课程列表
const loadCourses = async () => {
  try {
    const [coursesRes, classesRes, assignmentsRes] = await Promise.all([
      getCourses(),
      getClasses(),
      getAssignments()
    ])

    const apiClasses = (coursesRes.code === 200 && classesRes.data) ? (classesRes.data || []) : []
    const apiAssignments = (assignmentsRes.code === 200 && assignmentsRes.data) ? (assignmentsRes.data || []) : []

    // 按 course_id 统计班级数
    const classCountByCourse: Record<string, number> = {}
    const classesByCourse: Record<string, any[]> = {}
    for (const cls of apiClasses) {
      const cid = String(cls.course_id || cls.courseId || '')
      if (cid) {
        classCountByCourse[cid] = (classCountByCourse[cid] || 0) + 1
        if (!classesByCourse[cid]) classesByCourse[cid] = []
        classesByCourse[cid].push({ id: cls.class_id || cls.id, name: cls.class_name || cls.name })
      }
    }

    // 按 course_id 统计作业数（通过 class_id → course_id 关联）
    const assignmentCountByCourse: Record<string, number> = {}
    for (const a of apiAssignments) {
      const cls = apiClasses.find((c: any) => String(c.class_id || c.id) === String(a.class_id || a.classId))
      if (cls) {
        const cid = String(cls.course_id || cls.courseId || '')
        if (cid) {
          assignmentCountByCourse[cid] = (assignmentCountByCourse[cid] || 0) + 1
        }
      }
    }

    if (coursesRes.code === 200 && coursesRes.data) {
      courses.value = (coursesRes.data || []).map((course: any) => {
        const cid = String(course.course_id || course.id || '')
        return {
          ...course,
          id: course.course_id || course.id,
          name: course.course_name || course.name,
          code: course.course_code || course.code,
          color: course.color || '#165DFF',
          status: course.status || 'active',
          classCount: classCountByCourse[cid] || 0,
          assignmentCount: assignmentCountByCourse[cid] || 0,
          classes: classesByCourse[cid] || []
        }
      })
    }
  } catch (error) {
    console.error('加载课程失败', error)
  }
}

onMounted(async () => {
  await loadCourses()
  if (isClassPage.value && !selectedCourseId.value && courses.value.length > 0) {
    selectedCourseId.value = courses.value[0].id
  }
  await loadClasses()
})

const manageClasses = (course: any) => {
  selectedCourseId.value = course.id
  router.push('/teacher/classes')
}

const handleCourseSelect = () => {
  classSearch.value = ''
}

const showCreateClassDialog = () => {
  if (!selectedCourseId.value) {
    ElMessage.warning('请先选择一个课程')
    return
  }
  editingClass.value = null
  Object.assign(classForm, {
    name: '',
    classCode: '',
    courseId: selectedCourseId.value
  })
  classDialogVisible.value = true
}

const editClass = (cls: any) => {
  editingClass.value = cls
  Object.assign(classForm, {
    name: cls.name,
    classCode: cls.class_code || cls.classCode || '',
    courseId: cls.courseId || cls.course_id
  })
  classDialogVisible.value = true
}

const saveClass = async () => {
  if (!classFormRef.value) return

  try {
    await classFormRef.value.validate()

    if (editingClass.value) {
      const classId = editingClass.value.id || editingClass.value.class_id
      const response = await updateClass(String(classId), {
        className: classForm.name,
        classCode: classForm.classCode
      })

      if ((response.code === 200 || response.code === 201) && response.data) {
        ElMessage.success('班级更新成功')
        await loadClasses()
        await loadCourses()
      } else {
        ElMessage.error('班级更新失败')
      }
    } else {
      const response = await createClass({
        courseId: classForm.courseId,
        className: classForm.name,
        classCode: classForm.classCode
      })

      if (response && (response.code === 200 || response.code === 201)) {
        ElMessage.success('班级创建成功')
        await loadClasses()
        await loadCourses()
        classDialogVisible.value = false
      } else {
        ElMessage.error(response?.message || '班级创建失败')
      }
    }

    classDialogVisible.value = false
  } catch (error) {
    console.error('班级保存失败', error)
    ElMessage.error('班级保存失败')
  }
}

const deleteClass = (cls: any) => {
  ElMessageBox.confirm(`确定要删除班级"${cls.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteClassApi(String(cls.id))
      await loadClasses()
      ElMessage.success('删除成功')
    } catch (e) {
      ElMessage.error('删除失败')
    }
  })
}

const importStudents = (cls: any) => {
  selectedClass.value = cls
  previewData.value = []
  importDialogVisible.value = true
}

const showAddStudentDialog = (cls: any) => {
  selectedClass.value = cls
  addStudentId.value = ''
  foundStudent.value = null
  searchDone.value = false
  addStudentDialogVisible.value = true
}

const searchStudent = async () => {
  const keyword = addStudentId.value.trim()
  if (!keyword) return
  searchingStudent.value = true
  searchDone.value = false
  foundStudent.value = null
  try {
    const res = await getStudents({ keyword, size: 10 })
    if (res.code === 200 && res.data) {
      const list = res.data.students || res.data || []
      foundStudent.value = list.find((s: any) => s.student_id === keyword) || list[0] || null
    }
  } catch (e) { console.error('搜索学生失败', e) }
  finally {
    searchingStudent.value = false
    searchDone.value = true
  }
}

const confirmAddStudent = async () => {
  if (!foundStudent.value || !selectedClass.value) return
  addingStudent.value = true
  try {
    const classId = selectedClass.value.id || selectedClass.value.class_id
    await addStudentToClass(String(classId), { studentUserId: foundStudent.value.user_id })
    ElMessage.success(`${foundStudent.value.student_id} 已添加到班级`)
    addStudentDialogVisible.value = false
    await loadClasses()
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.detail || '添加失败')
  } finally {
    addingStudent.value = false
  }
}

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
      previewData.value = []
    }
  } catch (error: any) {
    console.error('文件解析失败:', error)
    ElMessage.error('文件解析失败: ' + (error.message || '未知错误'))
    previewData.value = []
  }
}

const parseExcelFile = (file: File): Promise<any[]> => {
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
              studentId: String(row[0] || ''),
              name: String(row[1] || ''),
              email: String(row[2] || ''),
              phone: String(row[3] || ''),
              password: String(row[4] || '')
            })
          }
        }
        console.log('Excel解析结果:', results)
        resolve(results)
      } catch (err) {
        console.error('Excel解析错误:', err)
        reject(err)
      }
    }
    reader.onerror = (err) => {
      console.error('FileReader错误:', err)
      reject(err)
    }
    reader.readAsArrayBuffer(file)
  })
}

const parsePDFFile = async (file: File): Promise<any[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n'
    }

    const results: any[] = []
    const lines = fullText.split(/[\n\r]+/).filter(line => line.trim())

    for (const line of lines) {
      const parts = line.split(/[\s,;\t]+/).filter(p => p.trim())
      if (parts.length >= 2) {
        const hasEmail = parts.some(p => p.includes('@'))
        if (hasEmail || /^[A-Za-z0-9]+$/.test(parts[0])) {
          results.push({
            studentId: parts[0] || '',
            name: parts[1] || '',
            email: parts.find(p => p.includes('@')) || '',
            phone: parts.find(p => /^1[3-9]\d{9}$/.test(p)) || '',
            password: ''
          })
        }
      }
    }

    return results
  } catch (err: any) {
    console.error('PDF解析错误:', err)
    throw new Error('PDF解析失败: ' + (err.message || '请检查PDF文件格式'))
  }
}

const parseCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        console.log('CSV内容:', content.substring(0, 200))
        const lines = content.split('\n').filter(line => line.trim())
        console.log('CSV行数:', lines.length)

        const results: any[] = []
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue

          const parts = line.split(/[,;\t]/).map(p => p.trim())
          if (parts.length >= 2) {
            results.push({
              studentId: parts[0] || '',
              name: parts[1] || '',
              email: parts[2] || '',
              phone: parts[3] || '',
              password: parts[4] || ''
            })
          }
        }
        console.log('CSV解析结果:', results)
        resolve(results)
      } catch (err) {
        console.error('CSV解析错误:', err)
        reject(err)
      }
    }
    reader.onerror = (err) => {
      console.error('FileReader错误:', err)
      reject(err)
    }
    reader.readAsText(file, 'UTF-8')
  })
}

// ============================================
// 修复2: confirmImport 方法 - 正确处理 axios 直接返回的响应结构
// ============================================
// 原问题：importStudentsApi 使用 axiosInstance.post 直接返回 axios 响应，
// 不是 {code, data, msg} 结构，所以 response.code 是 undefined
// 修复：统一处理两种可能的响应结构
const confirmImport = async () => {
  if (!selectedClass.value || !selectedImportFile.value) {
    ElMessage.warning('请先选择要导入的文件')
    return
  }

  const classId = selectedClass.value.id || selectedClass.value.class_id

  try {
    ElMessage.info('正在导入学生，请稍候...')
    const response = await importStudentsApi(classId, selectedImportFile.value)

    // 适配两种响应结构：
    // 1. request 封装返回: { code, data, msg }
    // 2. axiosInstance 直接返回: { data: { detail, ... }, status, ... }
    let resData: any = null
    let resCode: number = 0
    let resMsg: string = ''

    if (response && typeof response.code === 'number') {
      // 结构1: 经过 request 封装
      resCode = response.code
      resData = response.data
      resMsg = response.msg || ''
    } else if (response && response.data) {
      // 结构2: axios 原始响应 或 后端直接返回的对象
      // 可能是 { data: { detail: "..." } } 或 { detail: "..." }
      const data = response.data
      if (typeof data.code === 'number') {
        resCode = data.code
        resData = data.data
        resMsg = data.msg || data.message || ''
      } else {
        // 后端直接返回业务数据（如 { detail: "..." }）
        resData = data
        resCode = 200  // 假设成功，后面根据 detail 判断
      }
    }

    // 检查后端是否返回了错误详情（如 "只支持CSV或Excel文件"）
    if (resData && resData.detail) {
      ElMessage.error(resData.detail)
      return
    }

    if (resCode === 200 || resCode === 201) {
      const data = resData || {}
      const successCount = data.success_count || 0
      const failCount = data.fail_count || 0
      const failReasons = data.fail_reasons || []

      if (successCount > 0) {
        ElMessage.success(`成功导入 ${successCount} 名学生`)
      }
      if (failCount > 0) {
        ElMessage.warning(`${failCount} 名学生导入失败`)
        failReasons.forEach((reason: string) => {
          console.warn('导入失败详情:', reason)
        })
      }
      if (successCount === 0 && failCount === 0) {
        ElMessage.success('导入完成')
      }

      await loadClasses()
      importDialogVisible.value = false
      selectedImportFile.value = null
      previewData.value = []
    } else {
      ElMessage.error(resMsg || '导入失败')
    }
  } catch (error: any) {
    console.error('导入学生失败:', error)
    // 捕获 axios 错误响应
    const detail = error?.response?.data?.detail
    const message = error?.response?.data?.msg || error?.response?.data?.message
    ElMessage.error(detail || message || error?.message || '导入失败，请检查网络连接')
  }
}

const loadClasses = async () => {
  try {
    const response = await getClasses()
    if (response.code === 200 && response.data) {
      const courseNameById = new Map(courses.value.map((course: any) => [String(course.id), course.name]))
      const list = (response.data || []).map((cls: any) => ({
        ...cls,
        id: cls.class_id || cls.id,
        name: cls.class_name || cls.name,
        courseId: cls.course_id || cls.courseId,
        courseName: cls.course_name || courseNameById.get(String(cls.course_id || cls.courseId)) || '',
        studentCount: 0,
        createTime: cls.create_time || ''
      }))

      // 异步加载每个班级的学生数
      await Promise.all(list.map(async (c: any) => {
        try {
          const sRes = await getClassStudents(String(c.id))
          if (sRes.code === 200 && sRes.data) {
            c.studentCount = (sRes.data || []).length
          }
        } catch (e) { /* ignore */ }
      }))

      classes.value = list
    }
  } catch (error) {
    console.error('加载班级列表失败:', error)
  }
}

const viewStudents = async (cls: any) => {
  selectedClass.value = cls
  studentsDialogVisible.value = true
  try {
    const response = await getClassStudents(cls.id || cls.class_id)
    if (response.code === 200 && response.data) {
      students.value = (response.data || []).map((s: any) => ({
        id: s.user_id || s.id,
        name: s.real_name || s.name,
        studentId: s.student_id || s.studentId,
        email: s.email || '',
        phone: s.phone || '',
        joinedAt: s.joined_at ? new Date(s.joined_at).toLocaleString('zh-CN') : ''
      }))
    }
  } catch (error) {
    console.error('加载学生列表失败', error)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.course-management-container {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  border: 1px solid rgba(22, 93, 255, 0.1);
  border-radius: var(--border-radius-md);
  background:
    linear-gradient(90deg, rgba(22, 93, 255, 0.09), rgba(124, 58, 237, 0.08) 52%, rgba(255, 125, 0, 0.08)),
    var(--bg-primary);
}

.header-left h1 {
  color: var(--text-primary);
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-xs) 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header-desc {
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.logout-btn {
  background-color: var(--danger-color);
  border-color: var(--danger-color);

  &:hover {
    background-color: var(--danger-light);
    border-color: var(--danger-light);
  }
}

.management-section {
  margin-top: var(--spacing-lg);
}

.section-header {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-input {
  width: 300px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.course-card {
  border: 1px solid rgba(22, 93, 255, 0.1);
  transition: all var(--transition-fast);
  overflow: hidden;
}

.course-card:hover {
  border-color: rgba(124, 58, 237, 0.35);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.course-header {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.course-color {
  width: 5px;
  border-radius: var(--border-radius-full);
  flex-shrink: 0;
}

.course-info {
  flex: 1;
}

.course-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.course-code {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin: 0;
}

.course-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-hover);
  border-radius: var(--border-radius-sm);
}

.course-classes {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.classes-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.classes-table-card {
  border: 1px solid rgba(8, 145, 178, 0.16);
}

.color-picker {
  display: flex;
  gap: var(--spacing-sm);
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 2px var(--bg-primary);
}

.import-content {
  padding: var(--spacing-md) 0;
}

.upload-area {
  width: 100%;
}

.preview-section {
  margin-top: var(--spacing-lg);
}

.preview-section h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.preview-count {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--spacing-sm);
}

.students-content {
  padding: var(--spacing-md) 0;
}

.students-header {
  margin-bottom: var(--spacing-md);
}

.students-header .search-input {
  width: 300px;
}

@media (max-width: 1200px) {
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .course-management-container {
    padding: var(--spacing-md);
  }

  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .section-header {
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>
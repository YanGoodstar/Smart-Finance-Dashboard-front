<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import MetricCard from '@/components/MetricCard.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getImportJob, listImportJobs, uploadImportJob } from '@/api/import-jobs'
import type { ImportJobResponse, ImportSourceType } from '@/types/import-job'
import { compactNumber, importSourceLabel } from '@/utils/format'
import ImportJobDetailCard from '@/views/imports/ImportJobDetailCard.vue'
import ImportJobsTable from '@/views/imports/ImportJobsTable.vue'
import ImportUploadPanel from '@/views/imports/ImportUploadPanel.vue'

const jobs = ref<ImportJobResponse[]>([])
const selectedJob = ref<ImportJobResponse | null>(null)
const selectedJobId = ref<number | null>(null)
const sourceType = ref<ImportSourceType>('ALIPAY_CSV')
const selectedFile = ref<File | null>(null)
const page = ref(0)
const size = ref(8)
const total = ref(0)
const listLoading = ref(false)
const detailLoading = ref(false)
const uploadLoading = ref(false)
const listError = ref('')
const detailError = ref('')

let refreshTimer: number | null = null

const fileName = computed(() => selectedFile.value?.name ?? '')
const fileSizeLabel = computed(() => {
  if (!selectedFile.value) {
    return ''
  }
  const sizeInMb = selectedFile.value.size / 1024 / 1024
  return `${sizeInMb.toFixed(sizeInMb >= 1 ? 2 : 3)} MB`
})

const runningJobsCount = computed(() => jobs.value.filter((job) => job.execution.running).length)
const terminalJobsCount = computed(() => jobs.value.filter((job) => job.execution.terminal).length)
const duplicateHintsCount = computed(() =>
  jobs.value.reduce((totalCount, job) => totalCount + job.processingSummary.suspectedDuplicateCount, 0),
)
const failedJobsCount = computed(() => jobs.value.filter((job) => job.status === 'FAILED').length)

function stopAutoRefresh() {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer)
    refreshTimer = null
  }
}

function startAutoRefresh() {
  stopAutoRefresh()
  refreshTimer = window.setInterval(() => {
    void loadJobs(true)
  }, 4000)
}

watch(
  () => selectedJob.value?.execution.running,
  (running) => {
    if (running) {
      startAutoRefresh()
      return
    }
    stopAutoRefresh()
  },
  { immediate: true },
)

onMounted(() => {
  void loadJobs()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})

function applySelection(nextSelectedJobId: number | null) {
  selectedJobId.value = nextSelectedJobId
}

async function loadJobs(preserveSelection = true) {
  listLoading.value = true
  listError.value = ''

  try {
    const response = await listImportJobs(page.value, size.value)
    jobs.value = response.items
    total.value = response.total

    const nextSelectedJobId =
      preserveSelection && selectedJobId.value !== null
        ? selectedJobId.value
        : response.items[0]?.id ?? null

    applySelection(nextSelectedJobId)

    if (nextSelectedJobId !== null) {
      await loadJobDetail(nextSelectedJobId)
    } else {
      selectedJob.value = null
      detailError.value = ''
    }
  } catch (error) {
    listError.value = error instanceof Error ? error.message : '获取导入任务失败'
  } finally {
    listLoading.value = false
  }
}

async function loadJobDetail(jobId: number) {
  detailLoading.value = true
  detailError.value = ''

  try {
    selectedJob.value = await getImportJob(jobId)
  } catch (error) {
    detailError.value = error instanceof Error ? error.message : '获取任务详情失败'
  } finally {
    detailLoading.value = false
  }
}

async function handleUpload() {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择要导入的 CSV 文件')
    return
  }

  uploadLoading.value = true

  try {
    const createdJob = await uploadImportJob(sourceType.value, selectedFile.value)
    ElMessage.success('已开始导入，可在列表中查看处理进度')
    selectedFile.value = null
    page.value = 0
    applySelection(createdJob.id)
    selectedJob.value = createdJob
    await loadJobs(true)
  } catch (error) {
    listError.value = error instanceof Error ? error.message : '提交导入任务失败'
  } finally {
    uploadLoading.value = false
  }
}

function handleSelectJob(jobId: number) {
  applySelection(jobId)
  void loadJobDetail(jobId)
}

function handlePageChange(nextPage: number) {
  page.value = nextPage - 1
  void loadJobs(false)
}

function handleSizeChange(nextSize: number) {
  size.value = nextSize
  page.value = 0
  void loadJobs(false)
}
</script>

<template>
  <div class="sf-page imports-view">
    <section class="sf-card sf-page-hero imports-view__hero">
      <div class="sf-page-hero__eyebrow">账单导入</div>
      <h1 class="sf-page-hero__title">导入记录一目了然</h1>
      <p class="sf-page-hero__copy">
        选择账单文件后即可开始导入，并在同一页面查看处理进度、完成情况和异常原因。
      </p>
      <div class="sf-page-hero__actions imports-view__hero-actions">
        <StatusTag v-if="selectedJob" mode="import-status" :value="selectedJob.status" />
        <span class="imports-view__hero-note">{{ importSourceLabel(sourceType) }}</span>
        <el-button plain :icon="RefreshRight" @click="loadJobs()">刷新记录</el-button>
      </div>
    </section>

    <section class="sf-card-grid sf-card-grid--4">
      <MetricCard title="导入记录" :value="compactNumber(total)" hint="最近导入的账单都会显示在这里" accent="primary" />
      <MetricCard title="进行中" :value="compactNumber(runningJobsCount)" hint="仍在处理中的导入记录" accent="accent" />
      <MetricCard title="已完成" :value="compactNumber(terminalJobsCount)" hint="已经处理完的导入记录" accent="success" />
      <MetricCard title="重复提醒" :value="compactNumber(duplicateHintsCount)" hint="需要你留意的重复记录数量" accent="danger" />
    </section>

    <section class="imports-view__content">
      <ImportUploadPanel
        v-model:source-type="sourceType"
        :file-name="fileName"
        :file-size-label="fileSizeLabel"
        :uploading="uploadLoading"
        @file-picked="selectedFile = $event"
        @submit="handleUpload"
      />

      <ImportJobDetailCard :job="selectedJob" :loading="detailLoading" :error="detailError" />
    </section>

    <ImportJobsTable
      :jobs="jobs"
      :loading="listLoading"
      :error="listError"
      :page="page"
      :size="size"
      :total="total"
      :selected-job-id="selectedJobId"
      @select="handleSelectJob"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="loadJobs()"
    />

    <section class="sf-card sf-panel imports-view__footer">
      <h2 class="sf-section-title">导入提醒</h2>
      <div class="sf-inline-note">
        当前有 {{ compactNumber(failedJobsCount) }} 条导入记录未完全成功。遇到异常时，可以打开右侧详情查看原因并重新整理账单。
      </div>
    </section>
  </div>
</template>

<style scoped>
.imports-view__hero {
  background:
    radial-gradient(circle at top right, rgba(23, 57, 89, 0.18), transparent 32%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(248, 241, 230, 0.98));
}

.imports-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 24px;
}

.imports-view__content > * {
  min-width: 0;
}

.imports-view__hero-actions {
  align-items: center;
}

.imports-view__hero-note {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  color: var(--sf-primary);
  font-weight: 600;
}

.imports-view__footer {
  display: grid;
  gap: 8px;
}

@media (max-width: 1100px) {
  .imports-view__content {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import type { ImportJobResponse } from '@/types/import-job'
import { compactNumber, formatDate, importSourceLabel } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    job?: ImportJobResponse | null
    loading?: boolean
    error?: string
  }>(),
  {
    job: null,
    loading: false,
    error: '',
  },
)

const progressPercentage = computed(() => {
  if (!props.job) {
    return 0
  }
  const total = props.job.processingSummary.totalCount
  if (total <= 0) {
    return props.job.execution.terminal ? 100 : 0
  }
  return Math.min(100, Math.round((props.job.processingSummary.processedCount / total) * 100))
})

const executionLabel = computed(() => {
  if (!props.job) {
    return '--'
  }
  if (props.job.execution.running) {
    return '处理中'
  }
  if (props.job.execution.terminal) {
    return '已结束'
  }
  return '待启动'
})
</script>

<template>
  <section class="sf-card sf-panel detail-card">
    <div class="detail-card__header">
      <div>
        <h2 class="sf-section-title">任务详情</h2>
        <div class="sf-inline-note">展示单个导入任务的执行结果、处理统计和错误摘要。</div>
      </div>
      <StatusTag v-if="job" mode="import-status" :value="job.status" />
    </div>

    <el-alert v-if="error" type="error" :closable="false" :title="error" show-icon />

    <el-skeleton v-else-if="loading" :rows="7" animated />

    <div v-else-if="!job" class="sf-data-empty">
      请选择一条导入任务记录查看详情。
    </div>

    <template v-else>
      <div class="detail-card__chips">
        <span class="sf-code-chip">JOB-{{ job.id }}</span>
        <span class="sf-code-chip">{{ importSourceLabel(job.sourceType) }}</span>
        <span class="sf-code-chip">{{ executionLabel }}</span>
      </div>

      <el-progress :percentage="progressPercentage" :stroke-width="12" :show-text="true" />

      <div class="sf-kv-list">
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">处理总数</span>
          <span class="sf-kv-item__value">{{ compactNumber(job.processingSummary.totalCount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">已处理</span>
          <span class="sf-kv-item__value">{{ compactNumber(job.processingSummary.processedCount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">成功 / 失败</span>
          <span class="sf-kv-item__value">
            {{ compactNumber(job.processingSummary.successCount) }} / {{ compactNumber(job.processingSummary.failedCount) }}
          </span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">疑似重复</span>
          <span class="sf-kv-item__value">{{ compactNumber(job.processingSummary.suspectedDuplicateCount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">开始 / 结束</span>
          <span class="sf-kv-item__value">
            {{ formatDate(job.execution.startedAt, true) }} / {{ formatDate(job.execution.finishedAt, true) }}
          </span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">创建 / 更新</span>
          <span class="sf-kv-item__value">{{ formatDate(job.createdAt, true) }} / {{ formatDate(job.updatedAt, true) }}</span>
        </div>
      </div>

      <el-alert
        v-if="job.processingSummary.errorSummary"
        type="warning"
        :closable="false"
        show-icon
        :title="job.processingSummary.errorSummary"
      />
    </template>
  </section>
</template>

<style scoped>
.detail-card {
  display: grid;
  gap: 18px;
}

.detail-card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.detail-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 960px) {
  .detail-card__header {
    flex-direction: column;
  }
}
</style>

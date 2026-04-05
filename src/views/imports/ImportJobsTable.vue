<script setup lang="ts">
import { RefreshRight } from '@element-plus/icons-vue'
import StatusTag from '@/components/StatusTag.vue'
import type { ImportJobResponse } from '@/types/import-job'
import { compactNumber, formatDate, importSourceLabel } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    jobs: ImportJobResponse[]
    loading?: boolean
    error?: string
    page: number
    size: number
    total: number
    selectedJobId?: number | null
  }>(),
  {
    loading: false,
    error: '',
    selectedJobId: null,
  },
)

const emit = defineEmits<{
  select: [jobId: number]
  'page-change': [page: number]
  'size-change': [size: number]
  refresh: []
}>()

function rowClassName(args: { row: ImportJobResponse }) {
  return args.row.id === props.selectedJobId ? 'jobs-table__row is-selected' : 'jobs-table__row'
}
</script>

<template>
  <section class="sf-card sf-panel jobs-table">
    <div class="jobs-table__header">
      <div>
        <h2 class="sf-section-title jobs-table__title">导入记录</h2>
        <div class="sf-inline-note">选中一条记录后，可在右侧查看处理进度和结果。</div>
      </div>
      <el-button plain :icon="RefreshRight" @click="emit('refresh')">刷新</el-button>
    </div>

    <el-alert v-if="error" type="error" :closable="false" :title="error" show-icon />

    <div v-if="!loading && jobs.length === 0" class="sf-data-empty">
      还没有导入记录，上传账单后会在这里显示处理结果。
    </div>

    <template v-else>
      <div class="jobs-table__table-wrap">
        <el-table
          :data="jobs"
          :loading="loading"
          stripe
          class="jobs-table__table"
          :row-class-name="rowClassName"
          @row-click="emit('select', $event.id)"
        >
          <el-table-column label="导入批次" min-width="110">
            <template #default="{ row }">
              第 {{ row.id }} 批
            </template>
          </el-table-column>

          <el-table-column label="来源" min-width="120">
            <template #default="{ row }">
              {{ importSourceLabel(row.sourceType) }}
            </template>
          </el-table-column>

          <el-table-column label="状态" min-width="120">
            <template #default="{ row }">
              <StatusTag mode="import-status" :value="row.status" />
            </template>
          </el-table-column>

          <el-table-column label="处理进度" min-width="180">
            <template #default="{ row }">
              {{ compactNumber(row.processingSummary.processedCount) }} /
              {{ compactNumber(row.processingSummary.totalCount) }}
            </template>
          </el-table-column>

          <el-table-column label="成功 / 失败" min-width="150">
            <template #default="{ row }">
              {{ compactNumber(row.processingSummary.successCount) }} /
              {{ compactNumber(row.processingSummary.failedCount) }}
            </template>
          </el-table-column>

          <el-table-column label="重复提醒" min-width="116">
            <template #default="{ row }">
              {{ compactNumber(row.processingSummary.suspectedDuplicateCount) }}
            </template>
          </el-table-column>

          <el-table-column label="最近更新" min-width="164">
            <template #default="{ row }">
              {{ formatDate(row.updatedAt, true) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click.stop="emit('select', row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="jobs-table__pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="page + 1"
          :page-size="size"
          :total="total"
          :page-sizes="[8, 12, 20]"
          @current-change="emit('page-change', $event)"
          @size-change="emit('size-change', $event)"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.jobs-table {
  display: grid;
  gap: 16px;
}

.jobs-table__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.jobs-table__title {
  margin-bottom: 8px;
}

.jobs-table__table {
  width: 100%;
}

.jobs-table__table-wrap {
  overflow-x: auto;
}

.jobs-table__table-wrap :deep(.el-table) {
  min-width: 980px;
}

.jobs-table__pagination {
  display: flex;
  justify-content: flex-end;
  overflow-x: auto;
}

.jobs-table :deep(.jobs-table__row) {
  cursor: pointer;
}

.jobs-table :deep(.jobs-table__row.is-selected) {
  --el-table-tr-bg-color: rgba(183, 138, 77, 0.12);
}

@media (max-width: 960px) {
  .jobs-table__header {
    flex-direction: column;
  }

  .jobs-table__pagination {
    justify-content: flex-start;
  }
}
</style>

<script setup lang="ts">
import StatusTag from '@/components/StatusTag.vue'
import type { BudgetProgressResponse } from '@/types/budget'
import { displayCategory, formatMoney, formatPercent } from '@/utils/format'

defineProps<{
  progress: BudgetProgressResponse | null
  loading?: boolean
}>()

defineEmits<{
  pageChange: [number]
  sizeChange: [number]
}>()
</script>

<template>
  <section class="sf-panel sf-card budget-progress">
    <div class="budget-progress__header">
      <div>
        <div class="sf-section-title">预算进度</div>
        <div class="sf-inline-note">看看哪些分类更接近预算上限。</div>
      </div>
      <StatusTag v-if="progress?.configured" :value="progress.warningLevel" />
    </div>

    <div v-if="!progress?.items.length" class="sf-data-empty">
      当前条件下还没有可展示的预算进度，换个时间或分类再看看。
    </div>

    <template v-else>
      <div class="budget-progress__table-shell">
        <el-table class="budget-progress__table" :data="progress.items" v-loading="loading">
          <el-table-column label="预算项" min-width="150">
            <template #default="{ row }">
              {{ displayCategory(row.category) }}
            </template>
          </el-table-column>

          <el-table-column label="预算金额" min-width="120" align="right">
            <template #default="{ row }">
              {{ formatMoney(row.budgetAmount) }}
            </template>
          </el-table-column>

          <el-table-column label="实际支出" min-width="120" align="right">
            <template #default="{ row }">
              {{ formatMoney(row.actualSpent) }}
            </template>
          </el-table-column>

          <el-table-column label="剩余金额" min-width="120" align="right">
            <template #default="{ row }">
              {{ formatMoney(row.remainingAmount) }}
            </template>
          </el-table-column>

          <el-table-column label="使用率" min-width="100">
            <template #default="{ row }">
              {{ formatPercent(row.usageRate) }}
            </template>
          </el-table-column>

          <el-table-column label="预警状态" min-width="110">
            <template #default="{ row }">
              <StatusTag :value="row.warningLevel" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="budget-progress__footer">
        <div class="budget-progress__pagination-shell">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page="progress.page"
            :page-size="progress.size"
            :page-sizes="[5, 10, 20]"
            :total="progress.total"
            @current-change="$emit('pageChange', $event)"
            @size-change="$emit('sizeChange', $event)"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.budget-progress {
  min-width: 0;
}

.budget-progress__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.budget-progress__table-shell,
.budget-progress__pagination-shell {
  overflow-x: auto;
}

.budget-progress__table {
  min-width: 760px;
  width: 100%;
}

.budget-progress__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

:deep(.el-pagination) {
  min-width: max-content;
}

@media (max-width: 900px) {
  .budget-progress__header,
  .budget-progress__footer {
    justify-content: flex-start;
  }
}
</style>

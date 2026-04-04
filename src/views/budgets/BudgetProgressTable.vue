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
  <section class="sf-panel sf-card">
    <div class="budget-progress__header">
      <div>
        <div class="sf-section-title">预算进度</div>
        <div class="sf-inline-note">预算进度列表支持分页、分类过滤和分类来源过滤。</div>
      </div>
      <StatusTag v-if="progress?.configured" :value="progress.warningLevel" />
    </div>

    <div v-if="!progress?.items.length" class="sf-data-empty">
      当前筛选范围内没有预算进度数据，请检查预算月份、日期窗口或分类条件。
    </div>

    <template v-else>
      <el-table :data="progress.items" v-loading="loading">
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

        <el-table-column label="预警" min-width="110">
          <template #default="{ row }">
            <StatusTag :value="row.warningLevel" />
          </template>
        </el-table-column>
      </el-table>

      <div class="budget-progress__footer">
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
    </template>
  </section>
</template>

<style scoped>
.budget-progress__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.budget-progress__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 900px) {
  .budget-progress__header,
  .budget-progress__footer {
    justify-content: flex-start;
  }
}
</style>

<script setup lang="ts">
import type { BudgetResponse } from '@/types/budget'
import { toMonthLabel } from '@/utils/date'
import { displayCategory, formatDate, formatMoney } from '@/utils/format'

defineProps<{
  items: BudgetResponse[]
  loading?: boolean
}>()
</script>

<template>
  <section class="sf-panel sf-card">
    <div class="budget-list__header">
      <div class="sf-section-title">预算列表</div>
      <div class="sf-inline-note">`category = null` 会显示为“总预算”。</div>
    </div>

    <div v-if="!items.length" class="sf-data-empty">
      当前月份还没有预算记录，先创建总预算或分类预算。
    </div>

    <el-table v-else :data="items" v-loading="loading">
      <el-table-column label="预算月份" min-width="120">
        <template #default="{ row }">
          {{ toMonthLabel(row.budgetMonth) }}
        </template>
      </el-table-column>

      <el-table-column label="预算名称" min-width="140">
        <template #default="{ row }">
          {{ displayCategory(row.category) }}
        </template>
      </el-table-column>

      <el-table-column label="金额" min-width="120" align="right">
        <template #default="{ row }">
          {{ formatMoney(row.amount) }}
        </template>
      </el-table-column>

      <el-table-column label="更新时间" min-width="160">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt, true) }}
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<style scoped>
.budget-list__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

@media (max-width: 900px) {
  .budget-list__header {
    justify-content: flex-start;
  }
}
</style>

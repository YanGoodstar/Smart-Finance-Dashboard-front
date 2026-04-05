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
  <section class="sf-panel sf-card budget-list">
    <div class="budget-list__header">
      <div class="sf-section-title">预算列表</div>
    </div>

    <div v-if="!items.length" class="sf-data-empty">
      当前月份还没有预算记录，先创建总预算或分类预算。
    </div>

    <div v-else class="budget-list__table-shell">
      <el-table class="budget-list__table" :data="items" v-loading="loading">
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
    </div>
  </section>
</template>

<style scoped>
.budget-list {
  min-width: 0;
}

.budget-list__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 18px;
}

.budget-list__table-shell {
  overflow-x: auto;
}

.budget-list__table {
  min-width: 620px;
  width: 100%;
}
</style>

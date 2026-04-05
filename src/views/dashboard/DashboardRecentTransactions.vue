<script setup lang="ts">
import StatusTag from '@/components/StatusTag.vue'
import type { TransactionPageResponse } from '@/types/shared'
import { directionLabel, displayCategory, formatDate, formatMoney } from '@/utils/format'

defineProps<{
  transactions: TransactionPageResponse | null
  loading?: boolean
}>()

defineEmits<{
  pageChange: [number]
  sizeChange: [number]
}>()
</script>

<template>
  <section class="sf-panel sf-card dashboard-recent">
    <div class="dashboard-recent__header">
      <div class="sf-section-title">近期记录</div>
    </div>

    <div v-if="!transactions?.items.length" class="sf-data-empty">
      当前筛选范围内没有流水记录，请调整时间窗口或关键词重试。
    </div>

    <template v-else>
      <div class="dashboard-recent__table-shell">
        <el-table class="dashboard-recent__table" :data="transactions.items" v-loading="loading">
          <el-table-column label="日期" min-width="120">
            <template #default="{ row }">
              {{ formatDate(row.transactionDate) }}
            </template>
          </el-table-column>

          <el-table-column label="商户 / 摘要" min-width="220">
            <template #default="{ row }">
              <div class="dashboard-recent__merchant">{{ row.merchantName || '未知商户' }}</div>
              <div class="sf-inline-note">{{ row.summary || '无摘要' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="方向" min-width="90">
            <template #default="{ row }">
              {{ directionLabel(row.direction) }}
            </template>
          </el-table-column>

          <el-table-column label="金额" min-width="120" align="right">
            <template #default="{ row }">
              <span :class="row.direction === 'INCOME' ? 'sf-money-positive' : 'sf-money-negative'">
                {{ formatMoney(row.amount) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="分类" min-width="130">
            <template #default="{ row }">
              {{ displayCategory(row.finalCategory) }}
            </template>
          </el-table-column>

          <el-table-column label="分类方式" min-width="110">
            <template #default="{ row }">
              <StatusTag mode="source" :value="row.categorySource" />
            </template>
          </el-table-column>

          <el-table-column label="提醒" min-width="100">
            <template #default="{ row }">
              <StatusTag mode="duplicate" :value="row.suspectedDuplicate ? 'YES' : 'NO'" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="dashboard-recent__footer">
        <div class="dashboard-recent__pagination-shell">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page="transactions.page"
            :page-size="transactions.size"
            :page-sizes="[5, 10, 20]"
            :total="transactions.total"
            @current-change="$emit('pageChange', $event)"
            @size-change="$emit('sizeChange', $event)"
          />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dashboard-recent {
  min-width: 0;
}

.dashboard-recent__header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 18px;
}

.dashboard-recent__merchant {
  font-weight: 600;
  color: var(--sf-primary);
}

.dashboard-recent__table-shell,
.dashboard-recent__pagination-shell {
  overflow-x: auto;
}

.dashboard-recent__table {
  min-width: 900px;
  width: 100%;
}

.dashboard-recent__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

:deep(.el-pagination) {
  min-width: max-content;
}

@media (max-width: 900px) {
  .dashboard-recent__footer {
    justify-content: flex-start;
  }
}
</style>

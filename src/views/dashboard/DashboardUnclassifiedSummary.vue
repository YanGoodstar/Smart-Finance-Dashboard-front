<script setup lang="ts">
import type { DashboardUnclassifiedSummaryResponse } from '@/types/dashboard'
import { compactNumber, formatMoney } from '@/utils/format'

defineProps<{
  summary: DashboardUnclassifiedSummaryResponse | null
}>()
</script>

<template>
  <section class="sf-panel sf-card dashboard-unclassified">
    <div class="sf-section-title">待整理记录</div>

    <div v-if="!summary?.hasUnclassified" class="sf-data-empty">
      当前记录都已整理完成。
    </div>

    <div v-else class="dashboard-unclassified__grid">
      <div class="dashboard-unclassified__metric">
        <div class="dashboard-unclassified__label">交易数</div>
        <div class="dashboard-unclassified__value">{{ compactNumber(summary.transactionCount) }}</div>
      </div>
      <div class="dashboard-unclassified__metric">
        <div class="dashboard-unclassified__label">收入</div>
        <div class="dashboard-unclassified__value sf-money-positive">{{ formatMoney(summary.incomeAmount) }}</div>
      </div>
      <div class="dashboard-unclassified__metric">
        <div class="dashboard-unclassified__label">支出</div>
        <div class="dashboard-unclassified__value sf-money-negative">{{ formatMoney(summary.expenseAmount) }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard-unclassified {
  height: 100%;
}

.dashboard-unclassified__grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.dashboard-unclassified__metric {
  padding: 16px;
  border: 1px solid rgba(21, 35, 58, 0.08);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.5);
}

.dashboard-unclassified__label {
  font-size: 13px;
  color: var(--sf-text-muted);
}

.dashboard-unclassified__value {
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
  color: var(--sf-primary);
}
</style>

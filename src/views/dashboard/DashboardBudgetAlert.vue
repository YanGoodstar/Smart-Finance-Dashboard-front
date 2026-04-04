<script setup lang="ts">
import { computed } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import type { DashboardBudgetAlertResponse } from '@/types/dashboard'
import { formatMoney, formatPercent } from '@/utils/format'

const props = defineProps<{
  alert: DashboardBudgetAlertResponse | null
}>()

const percentage = computed(() => {
  const value = Number(props.alert?.usageRate ?? 0)
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.min(100, Math.round(value * 100)))
})

const progressStatus = computed(() => {
  const level = props.alert?.warningLevel
  if (level === 'OVER_BUDGET') return 'exception'
  if (level === 'NEAR_LIMIT') return 'warning'
  return 'success'
})
</script>

<template>
  <section class="sf-panel sf-card dashboard-budget-alert">
    <div class="dashboard-budget-alert__header">
      <div>
        <div class="sf-section-title">预算提醒</div>
        <div class="sf-inline-note">看板按当前时间窗口同步预算压力，直接暴露是否接近或超出预算。</div>
      </div>
      <StatusTag v-if="alert?.configured" :value="alert.warningLevel" />
    </div>

    <div v-if="!alert?.configured" class="sf-data-empty">
      当前月份还没有可用预算配置，预算页创建后这里会自动联动。
    </div>

    <template v-else>
      <el-progress :percentage="percentage" :status="progressStatus" :stroke-width="14" />

      <div class="sf-kv-list dashboard-budget-alert__metrics">
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">预算金额</span>
          <span class="sf-kv-item__value">{{ formatMoney(alert?.budgetAmount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">已支出</span>
          <span class="sf-kv-item__value">{{ formatMoney(alert?.spentAmount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">剩余额度</span>
          <span class="sf-kv-item__value">{{ formatMoney(alert?.remainingAmount) }}</span>
        </div>
        <div class="sf-kv-item">
          <span class="sf-kv-item__label">使用率</span>
          <span class="sf-kv-item__value">{{ formatPercent(alert?.usageRate) }}</span>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dashboard-budget-alert {
  height: 100%;
}

.dashboard-budget-alert__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.dashboard-budget-alert__metrics {
  margin-top: 20px;
}
</style>

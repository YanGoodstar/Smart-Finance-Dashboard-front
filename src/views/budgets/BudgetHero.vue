<script setup lang="ts">
import { computed } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatMoney } from '@/utils/format'
import { toMonthLabel } from '@/utils/date'

const props = withDefaults(
  defineProps<{
    budgetMonth: string
    budgetCount?: number
    configured?: boolean
    warningLevel?: string | null
    totalBudget?: string | null
    totalSpent?: string | null
    totalRemaining?: string | null
    loading?: boolean
  }>(),
  {
    budgetCount: 0,
    configured: false,
    warningLevel: null,
    totalBudget: null,
    totalSpent: null,
    totalRemaining: null,
    loading: false,
  },
)

defineEmits<{
  create: []
  refresh: []
}>()

const headline = computed(() => {
  if (!props.configured) {
    return '先建立预算基线，再观察分类支出是否逼近上限。'
  }
  return '总预算、分类预算和支出进度在同一页完成收口。'
})
</script>

<template>
  <section class="sf-page-hero sf-card budget-hero">
    <div class="sf-page-hero__eyebrow">Budgets / Agent-1</div>
    <h2 class="sf-page-hero__title">{{ headline }}</h2>
    <p class="sf-page-hero__copy">
      当前查看月份为 <strong>{{ toMonthLabel(budgetMonth) }}</strong>，
      已配置 <strong>{{ budgetCount }}</strong> 条预算记录。
      <template v-if="configured">
        总预算 {{ formatMoney(totalBudget) }}，已支出 {{ formatMoney(totalSpent) }}，剩余 {{ formatMoney(totalRemaining) }}。
      </template>
      <template v-else>本月尚未形成完整预算进度，可先创建“总预算”或分类预算。</template>
    </p>

    <div class="sf-page-hero__actions">
      <el-button type="primary" @click="$emit('create')">新建预算</el-button>
      <el-button plain :loading="loading" @click="$emit('refresh')">刷新预算</el-button>
      <span class="sf-code-chip">{{ toMonthLabel(budgetMonth) }}</span>
      <StatusTag v-if="configured" :value="warningLevel" />
    </div>
  </section>
</template>

<style scoped>
.budget-hero {
  background:
    radial-gradient(circle at top right, rgba(47, 125, 91, 0.14), transparent 30%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(245, 248, 242, 0.98));
}

.budget-hero strong {
  color: var(--sf-primary);
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { categorySourceLabel } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    dateFrom?: string
    dateTo?: string
    keyword?: string
    finalCategory?: string
    categorySource?: string
    transactionCount?: number
    loading?: boolean
  }>(),
  {
    dateFrom: '',
    dateTo: '',
    keyword: '',
    finalCategory: '',
    categorySource: '',
    transactionCount: 0,
    loading: false,
  },
)

defineEmits<{
  refresh: []
  reset: []
}>()

const filterChips = computed(() => {
  const chips: string[] = []

  if (props.finalCategory) {
    chips.push(`分类：${props.finalCategory}`)
  }
  if (props.categorySource) {
    chips.push(`来源：${categorySourceLabel(props.categorySource)}`)
  }
  if (props.keyword) {
    chips.push(`关键词：${props.keyword}`)
  }

  return chips
})
</script>

<template>
  <section class="sf-page-hero sf-card dashboard-hero">
    <div class="sf-page-hero__eyebrow">Dashboard / Agent-1</div>
    <h2 class="sf-page-hero__title">先看现金流，再看预算压力，把异常分类收拢到同一屏。</h2>
    <p class="sf-page-hero__copy">
      当前联调窗口覆盖 <strong>{{ dateFrom || '--' }}</strong> 到 <strong>{{ dateTo || '--' }}</strong>，
      共追踪 <strong>{{ transactionCount }}</strong> 条交易。页面查询参数会与路由同步，便于回放筛选状态。
    </p>

    <div class="sf-page-hero__actions">
      <el-button type="primary" :loading="loading" @click="$emit('refresh')">刷新数据</el-button>
      <el-button plain @click="$emit('reset')">恢复默认范围</el-button>
      <span class="sf-code-chip">{{ dateFrom || '--' }} -> {{ dateTo || '--' }}</span>
      <span v-for="chip in filterChips" :key="chip" class="dashboard-hero__chip">{{ chip }}</span>
    </div>
  </section>
</template>

<style scoped>
.dashboard-hero {
  background:
    radial-gradient(circle at top right, rgba(183, 138, 77, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.84), rgba(247, 242, 232, 0.96));
}

.dashboard-hero strong {
  color: var(--sf-primary);
}

.dashboard-hero__chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid rgba(21, 35, 58, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--sf-text-muted);
  font-size: 13px;
}
</style>

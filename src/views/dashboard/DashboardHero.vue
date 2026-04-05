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

const periodLabel = computed(() => {
  if (!props.dateFrom || !props.dateTo) {
    return '最近账务概览'
  }

  return `${props.dateFrom} 至 ${props.dateTo}`
})

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
    <div class="sf-page-hero__eyebrow">财务概览</div>
    <h2 class="sf-page-hero__title">收支走势、预算提醒和近期记录一屏掌握。</h2>
    <p class="sf-page-hero__copy">
      查看 <strong>{{ periodLabel }}</strong> 的收支变化与消费分布，
      共找到 <strong>{{ transactionCount }}</strong> 条相关记录。
    </p>

    <div class="sf-page-hero__actions dashboard-hero__actions">
      <div class="dashboard-hero__buttons">
        <el-button type="primary" @click="$emit('reset')">回到默认视图</el-button>
        <el-button plain :loading="loading" @click="$emit('refresh')">刷新</el-button>
      </div>

      <div class="dashboard-hero__meta">
        <span class="dashboard-hero__chip">{{ periodLabel }}</span>
        <span v-for="chip in filterChips" :key="chip" class="dashboard-hero__chip">{{ chip }}</span>
      </div>
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

.dashboard-hero__actions {
  align-items: flex-start;
}

.dashboard-hero__buttons,
.dashboard-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dashboard-hero__meta {
  min-width: 0;
}

.dashboard-hero__chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(21, 35, 58, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--sf-text-muted);
  font-size: 13px;
  word-break: break-word;
}

@media (max-width: 900px) {
  .dashboard-hero__actions {
    flex-direction: column;
  }
}
</style>

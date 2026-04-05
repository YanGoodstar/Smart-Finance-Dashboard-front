<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { RefreshRight } from '@element-plus/icons-vue'
import MetricCard from '@/components/MetricCard.vue'
import CategoryDonutChart from '@/components/charts/CategoryDonutChart.vue'
import TrendChart from '@/components/charts/TrendChart.vue'
import { getDashboardOverview } from '@/api/dashboard'
import type { DashboardOverviewResponse, DashboardQuery } from '@/types/dashboard'
import type { CategorySource } from '@/types/shared'
import { getPreviousMonthRange } from '@/utils/date'
import { compactNumber, formatMoney } from '@/utils/format'
import { getQueryNumber, getQueryString } from '@/utils/query'
import DashboardBudgetAlert from '@/views/dashboard/DashboardBudgetAlert.vue'
import DashboardFilters from '@/views/dashboard/DashboardFilters.vue'
import DashboardHero from '@/views/dashboard/DashboardHero.vue'
import DashboardRecentTransactions from '@/views/dashboard/DashboardRecentTransactions.vue'
import DashboardUnclassifiedSummary from '@/views/dashboard/DashboardUnclassifiedSummary.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const overview = ref<DashboardOverviewResponse | null>(null)
const currentQuery = reactive<DashboardQuery>(buildDefaultQuery())

let activeRequestId = 0

function buildDefaultQuery(): DashboardQuery {
  const range = getPreviousMonthRange()
  return {
    page: 1,
    size: 10,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
    finalCategory: undefined,
    categorySource: undefined,
    keyword: undefined,
  }
}

function parseCategorySource(value?: string): CategorySource | undefined {
  if (value === 'AUTO' || value === 'MANUAL' || value === 'UNCLASSIFIED') {
    return value
  }
  return undefined
}

function parseRouteQuery(): DashboardQuery {
  const defaults = buildDefaultQuery()
  return {
    page: Math.max(1, getQueryNumber(route.query.page, defaults.page)),
    size: Math.max(1, getQueryNumber(route.query.size, defaults.size)),
    dateFrom: getQueryString(route.query.dateFrom) || defaults.dateFrom,
    dateTo: getQueryString(route.query.dateTo) || defaults.dateTo,
    finalCategory: getQueryString(route.query.finalCategory) || undefined,
    categorySource: parseCategorySource(getQueryString(route.query.categorySource)),
    keyword: getQueryString(route.query.keyword) || undefined,
  }
}

function serializeQuery(query: DashboardQuery): LocationQueryRaw {
  const nextQuery: LocationQueryRaw = {
    page: String(query.page),
    size: String(query.size),
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  }

  if (query.finalCategory) {
    nextQuery.finalCategory = query.finalCategory
  }
  if (query.categorySource) {
    nextQuery.categorySource = query.categorySource
  }
  if (query.keyword) {
    nextQuery.keyword = query.keyword
  }

  return nextQuery
}

function shouldHydrateQuery(): boolean {
  return (
    !getQueryString(route.query.page) ||
    !getQueryString(route.query.size) ||
    !getQueryString(route.query.dateFrom) ||
    !getQueryString(route.query.dateTo)
  )
}

function assignQuery(next: DashboardQuery) {
  currentQuery.page = next.page
  currentQuery.size = next.size
  currentQuery.dateFrom = next.dateFrom
  currentQuery.dateTo = next.dateTo
  currentQuery.finalCategory = next.finalCategory
  currentQuery.categorySource = next.categorySource
  currentQuery.keyword = next.keyword
}

async function loadDashboard(query: DashboardQuery) {
  const requestId = ++activeRequestId
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getDashboardOverview({
      ...query,
      page: Math.max(query.page - 1, 0),
    })
    if (requestId !== activeRequestId) {
      return
    }
    overview.value = response
  } catch (error) {
    if (requestId !== activeRequestId) {
      return
    }
    overview.value = null
    errorMessage.value = error instanceof Error ? error.message : '看板数据加载失败'
  } finally {
    if (requestId === activeRequestId) {
      loading.value = false
    }
  }
}

function updateRoute(query: DashboardQuery) {
  void router.replace({ query: serializeQuery(query) })
}

function handleApply(query: DashboardQuery) {
  updateRoute(query)
}

function handleReset() {
  updateRoute(buildDefaultQuery())
}

function handlePageChange(page: number) {
  updateRoute({
    ...currentQuery,
    page,
  })
}

function handleSizeChange(size: number) {
  updateRoute({
    ...currentQuery,
    size,
    page: 1,
  })
}

watch(
  () => route.fullPath,
  async () => {
    const next = parseRouteQuery()

    if (shouldHydrateQuery()) {
      await router.replace({ query: serializeQuery(next) })
      return
    }

    assignQuery(next)
    await loadDashboard(next)
  },
  { immediate: true },
)

const summary = computed(() => overview.value?.summary)
const cards = computed(() => [
  {
    title: '总收入',
    value: formatMoney(summary.value?.totalIncome),
    hint: `交易笔数 ${compactNumber(summary.value?.transactionCount)}`,
    accent: 'success' as const,
  },
  {
    title: '总支出',
    value: formatMoney(summary.value?.totalExpense),
    hint: '当前筛选范围内的支出',
    accent: 'danger' as const,
  },
  {
    title: '净额',
    value: formatMoney(summary.value?.netAmount),
    hint: '收入减去支出后的结果',
    accent: 'accent' as const,
  },
  {
    title: '支出分类',
    value: compactNumber(overview.value?.categoryBreakdowns.length),
    hint: '已统计的支出分类数量',
    accent: 'primary' as const,
  },
])
</script>

<template>
  <div class="sf-page dashboard-page">
    <DashboardHero
      :date-from="currentQuery.dateFrom"
      :date-to="currentQuery.dateTo"
      :keyword="currentQuery.keyword"
      :final-category="currentQuery.finalCategory"
      :category-source="currentQuery.categorySource"
      :transaction-count="overview?.summary.transactionCount ?? 0"
      :loading="loading"
      @refresh="loadDashboard({ ...currentQuery })"
      @reset="handleReset"
    />

    <DashboardFilters :model-value="{ ...currentQuery }" :loading="loading" @apply="handleApply" @reset="handleReset" />

    <section v-if="errorMessage" class="sf-panel sf-card">
      <el-result icon="error" title="看板数据加载失败" :sub-title="errorMessage">
        <template #extra>
          <el-button type="primary" :icon="RefreshRight" @click="loadDashboard({ ...currentQuery })">重新加载</el-button>
        </template>
      </el-result>
    </section>

    <template v-else>
      <section class="sf-card-grid sf-card-grid--4 dashboard-page__metrics">
        <MetricCard
          v-for="card in cards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :hint="card.hint"
          :accent="card.accent"
        />
      </section>

      <section class="dashboard-page__charts">
        <section class="sf-panel sf-card">
          <div class="sf-section-title">收支趋势</div>
          <div v-if="!overview?.trendPoints.length" class="sf-data-empty">
            当前筛选范围内没有趋势数据，请切换日期范围后重试。
          </div>
          <TrendChart v-else :data="overview.trendPoints" />
        </section>

        <section class="sf-panel sf-card">
          <div class="sf-section-title">支出分类分布</div>
          <div v-if="!overview?.categoryBreakdowns.length" class="sf-data-empty">
            当前范围没有可展示的分类支出分布。
          </div>
          <CategoryDonutChart v-else :data="overview.categoryBreakdowns" />
        </section>
      </section>

      <section class="dashboard-page__summary">
        <DashboardBudgetAlert :alert="overview?.budgetAlert ?? null" />
        <DashboardUnclassifiedSummary :summary="overview?.unclassifiedSummary ?? null" />
      </section>

      <DashboardRecentTransactions
        :transactions="overview?.recentTransactions ?? null"
        :loading="loading"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </template>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-width: 0;
  overflow-x: hidden;
}

.dashboard-page > * {
  min-width: 0;
}

.dashboard-page__metrics,
.dashboard-page__charts,
.dashboard-page__summary {
  min-width: 0;
}

.dashboard-page__charts,
.dashboard-page__summary {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dashboard-page__charts > *,
.dashboard-page__summary > * {
  min-width: 0;
}

@media (max-width: 1100px) {
  .dashboard-page__charts,
  .dashboard-page__summary {
    grid-template-columns: 1fr;
  }
}
</style>

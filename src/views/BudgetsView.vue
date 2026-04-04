<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { RefreshRight } from '@element-plus/icons-vue'
import MetricCard from '@/components/MetricCard.vue'
import { createBudget, getBudgetProgress, listBudgets } from '@/api/budgets'
import type { BudgetProgressResponse, BudgetResponse, BudgetSaveRequest } from '@/types/budget'
import type { CategorySource } from '@/types/shared'
import { getPreviousMonthRange } from '@/utils/date'
import { compactNumber, formatMoney, formatPercent } from '@/utils/format'
import { getQueryNumber, getQueryString } from '@/utils/query'
import BudgetCreateForm from '@/views/budgets/BudgetCreateForm.vue'
import BudgetFilters from '@/views/budgets/BudgetFilters.vue'
import BudgetHero from '@/views/budgets/BudgetHero.vue'
import BudgetListTable from '@/views/budgets/BudgetListTable.vue'
import BudgetProgressTable from '@/views/budgets/BudgetProgressTable.vue'
import type { BudgetViewQuery } from '@/views/budgets/types'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const errorMessage = ref('')
const budgets = ref<BudgetResponse[]>([])
const progress = ref<BudgetProgressResponse | null>(null)
const currentQuery = reactive<BudgetViewQuery>(buildDefaultQuery())

let activeRequestId = 0

function buildDefaultQuery(): BudgetViewQuery {
  const range = getPreviousMonthRange()
  return {
    budgetMonth: range.budgetMonth,
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

function normalizeBudgetMonth(value?: string): string {
  if (!value) {
    return buildDefaultQuery().budgetMonth
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return `${value}-01`
  }
  return value
}

function parseRouteQuery(): BudgetViewQuery {
  const defaults = buildDefaultQuery()
  return {
    budgetMonth: normalizeBudgetMonth(getQueryString(route.query.budgetMonth) || defaults.budgetMonth),
    page: Math.max(1, getQueryNumber(route.query.page, defaults.page)),
    size: Math.max(1, getQueryNumber(route.query.size, defaults.size)),
    dateFrom: getQueryString(route.query.dateFrom) || defaults.dateFrom,
    dateTo: getQueryString(route.query.dateTo) || defaults.dateTo,
    finalCategory: getQueryString(route.query.finalCategory) || undefined,
    categorySource: parseCategorySource(getQueryString(route.query.categorySource)),
    keyword: getQueryString(route.query.keyword) || undefined,
  }
}

function serializeQuery(query: BudgetViewQuery): LocationQueryRaw {
  const nextQuery: LocationQueryRaw = {
    budgetMonth: query.budgetMonth,
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
    !getQueryString(route.query.budgetMonth) ||
    !getQueryString(route.query.page) ||
    !getQueryString(route.query.size) ||
    !getQueryString(route.query.dateFrom) ||
    !getQueryString(route.query.dateTo)
  )
}

function assignQuery(next: BudgetViewQuery) {
  currentQuery.budgetMonth = next.budgetMonth
  currentQuery.page = next.page
  currentQuery.size = next.size
  currentQuery.dateFrom = next.dateFrom
  currentQuery.dateTo = next.dateTo
  currentQuery.finalCategory = next.finalCategory
  currentQuery.categorySource = next.categorySource
  currentQuery.keyword = next.keyword
}

async function loadBudgets(query: BudgetViewQuery) {
  const requestId = ++activeRequestId
  loading.value = true
  errorMessage.value = ''

  try {
    const [budgetList, progressData] = await Promise.all([
      listBudgets(query.budgetMonth),
      getBudgetProgress({
        budgetMonth: query.budgetMonth,
        page: query.page,
        size: query.size,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        finalCategory: query.finalCategory,
        categorySource: query.categorySource,
        keyword: query.keyword,
      }),
    ])

    if (requestId !== activeRequestId) {
      return
    }

    budgets.value = budgetList.items
    progress.value = progressData
  } catch (error) {
    if (requestId !== activeRequestId) {
      return
    }
    budgets.value = []
    progress.value = null
    errorMessage.value = error instanceof Error ? error.message : '预算数据加载失败'
  } finally {
    if (requestId === activeRequestId) {
      loading.value = false
    }
  }
}

function updateRoute(query: BudgetViewQuery) {
  void router.replace({ query: serializeQuery(query) })
}

function handleApply(query: BudgetViewQuery) {
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

function getMonthDateRange(budgetMonth: string) {
  const [year, month] = budgetMonth.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const pad = (value: number) => String(value).padStart(2, '0')

  return {
    dateFrom: `${firstDay.getFullYear()}-${pad(firstDay.getMonth() + 1)}-${pad(firstDay.getDate())}`,
    dateTo: `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`,
  }
}

async function handleCreateBudget(payload: BudgetSaveRequest) {
  submitLoading.value = true

  try {
    await createBudget(payload)
    dialogVisible.value = false
    ElMessage.success('预算已保存')

    const monthRange = getMonthDateRange(payload.budgetMonth)
    updateRoute({
      ...currentQuery,
      budgetMonth: payload.budgetMonth,
      page: 1,
      dateFrom: monthRange.dateFrom,
      dateTo: monthRange.dateTo,
    })
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '预算保存失败')
  } finally {
    submitLoading.value = false
  }
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
    await loadBudgets(next)
  },
  { immediate: true },
)

const summaryCards = computed(() => [
  {
    title: '预算项数',
    value: compactNumber(budgets.value.length),
    hint: '包含总预算与分类预算',
    accent: 'primary' as const,
  },
  {
    title: '总预算',
    value: formatMoney(progress.value?.totalBudget),
    hint: progress.value?.configured ? '来自预算进度接口' : '当前未配置',
    accent: 'accent' as const,
  },
  {
    title: '已支出',
    value: formatMoney(progress.value?.totalSpent),
    hint: '按当前筛选窗口统计',
    accent: 'danger' as const,
  },
  {
    title: '使用率',
    value: formatPercent(progress.value?.usageRate),
    hint: progress.value?.configured ? '预算预警会同步显示' : '创建预算后可见',
    accent: 'success' as const,
  },
])
</script>

<template>
  <div class="sf-page budgets-page">
    <BudgetHero
      :budget-month="currentQuery.budgetMonth"
      :budget-count="budgets.length"
      :configured="progress?.configured ?? false"
      :warning-level="progress?.warningLevel"
      :total-budget="progress?.totalBudget"
      :total-spent="progress?.totalSpent"
      :total-remaining="progress?.totalRemaining"
      :loading="loading"
      @create="dialogVisible = true"
      @refresh="loadBudgets({ ...currentQuery })"
    />

    <BudgetFilters :model-value="{ ...currentQuery }" :loading="loading" @apply="handleApply" @reset="handleReset" />

    <BudgetCreateForm
      v-model="dialogVisible"
      :default-budget-month="currentQuery.budgetMonth"
      :submitting="submitLoading"
      @submit="handleCreateBudget"
    />

    <section v-if="errorMessage" class="sf-panel sf-card">
      <el-result icon="error" title="预算数据加载失败" :sub-title="errorMessage">
        <template #extra>
          <el-button type="primary" :icon="RefreshRight" @click="loadBudgets({ ...currentQuery })">重新加载</el-button>
        </template>
      </el-result>
    </section>

    <template v-else>
      <section class="sf-card-grid sf-card-grid--4 budgets-page__metrics">
        <MetricCard
          v-for="card in summaryCards"
          :key="card.title"
          :title="card.title"
          :value="card.value"
          :hint="card.hint"
          :accent="card.accent"
        />
      </section>

      <section class="budgets-page__overview">
        <BudgetListTable :items="budgets" :loading="loading" />

        <section class="sf-panel sf-card budgets-page__panel">
          <div class="sf-section-title">预算总览</div>

          <div v-if="!progress?.configured" class="sf-data-empty">
            当前月份还没有预算进度，创建预算后即可在这里查看预警与剩余额度。
          </div>

          <template v-else>
            <div class="sf-kv-list">
              <div class="sf-kv-item">
                <span class="sf-kv-item__label">总预算</span>
                <span class="sf-kv-item__value">{{ formatMoney(progress?.totalBudget) }}</span>
              </div>
              <div class="sf-kv-item">
                <span class="sf-kv-item__label">总支出</span>
                <span class="sf-kv-item__value">{{ formatMoney(progress?.totalSpent) }}</span>
              </div>
              <div class="sf-kv-item">
                <span class="sf-kv-item__label">剩余金额</span>
                <span class="sf-kv-item__value">{{ formatMoney(progress?.totalRemaining) }}</span>
              </div>
              <div class="sf-kv-item">
                <span class="sf-kv-item__label">使用率</span>
                <span class="sf-kv-item__value">{{ formatPercent(progress?.usageRate) }}</span>
              </div>
            </div>
          </template>
        </section>
      </section>

      <BudgetProgressTable
        :progress="progress"
        :loading="loading"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </template>
  </div>
</template>

<style scoped>
.budgets-page__overview {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
}

.budgets-page__panel {
  height: 100%;
}

@media (max-width: 1100px) {
  .budgets-page__overview {
    grid-template-columns: 1fr;
  }
}
</style>

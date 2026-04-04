<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { EditPen, RefreshRight } from '@element-plus/icons-vue'
import MetricCard from '@/components/MetricCard.vue'
import StatusTag from '@/components/StatusTag.vue'
import { categorySourceOptions } from '@/constants/options'
import { listTransactions, updateTransactionCategory } from '@/api/transactions'
import type { CategorySource, TransactionQuery, TransactionSummaryResponse } from '@/types/shared'
import { getPreviousMonthRange } from '@/utils/date'
import { compactQuery, getQueryNumber, getQueryString } from '@/utils/query'
import { directionLabel, formatDate, formatMoney } from '@/utils/format'
import TransactionCategoryDialog from '@/views/transactions/TransactionCategoryDialog.vue'
import TransactionFilterPanel from '@/views/transactions/TransactionFilterPanel.vue'

const route = useRoute()
const router = useRouter()

type TransactionFilters = {
  dateRange: [string, string]
  keyword: string
  finalCategory: string
  categorySource: CategorySource | ''
}

const previousMonthRange = getPreviousMonthRange()
const loading = ref(false)
const error = ref('')
const transactions = ref<TransactionSummaryResponse[]>([])
const total = ref(0)
const pagination = reactive({
  page: 0,
  size: 20,
})

const filters = ref<TransactionFilters>({
  dateRange: [previousMonthRange.dateFrom, previousMonthRange.dateTo] as [string, string],
  keyword: '',
  finalCategory: '',
  categorySource: '' as CategorySource | '',
})

const dialogVisible = ref(false)
const saveLoading = ref(false)
const editingTransaction = ref<TransactionSummaryResponse | null>(null)

const duplicateCount = computed(() => transactions.value.filter((item) => item.suspectedDuplicate).length)
const manualCount = computed(() => transactions.value.filter((item) => item.categorySource === 'MANUAL').length)
const unclassifiedCount = computed(() => transactions.value.filter((item) => item.categorySource === 'UNCLASSIFIED').length)
const currentRangeText = computed(() => `${filters.value.dateRange[0]} 至 ${filters.value.dateRange[1]}`)

function isValidCategorySource(value: string | undefined): value is CategorySource {
  return categorySourceOptions.some((option) => option.value === value)
}

function buildStateFromQuery(): {
  page: number
  size: number
  dateRange: [string, string]
  keyword: string
  finalCategory: string
  categorySource: CategorySource | ''
} {
  const queryPage = Math.max(getQueryNumber(route.query.page, 0), 0)
  const querySize = Math.max(getQueryNumber(route.query.size, 20), 1)
  const queryDateFrom = getQueryString(route.query.dateFrom) ?? previousMonthRange.dateFrom
  const queryDateTo = getQueryString(route.query.dateTo) ?? previousMonthRange.dateTo
  const queryCategorySource = getQueryString(route.query.categorySource)

  return {
    page: queryPage,
    size: querySize,
    dateRange: [queryDateFrom, queryDateTo] as [string, string],
    keyword: getQueryString(route.query.keyword) ?? '',
    finalCategory: getQueryString(route.query.finalCategory) ?? '',
    categorySource: isValidCategorySource(queryCategorySource) ? queryCategorySource : '',
  }
}

function buildRouteQuery(): LocationQueryRaw {
  return compactQuery({
    page: pagination.page,
    size: pagination.size,
    dateFrom: filters.value.dateRange[0],
    dateTo: filters.value.dateRange[1],
    keyword: filters.value.keyword.trim() || undefined,
    finalCategory: filters.value.finalCategory.trim() || undefined,
    categorySource: filters.value.categorySource || undefined,
  }) as LocationQueryRaw
}

async function loadTransactionsPage() {
  loading.value = true
  error.value = ''

  const params: TransactionQuery = {
    page: pagination.page,
    size: pagination.size,
    dateFrom: filters.value.dateRange[0],
    dateTo: filters.value.dateRange[1],
    keyword: filters.value.keyword.trim() || undefined,
    finalCategory: filters.value.finalCategory.trim() || undefined,
    categorySource: filters.value.categorySource || undefined,
  }

  try {
    const response = await listTransactions(params)
    transactions.value = response.items
    total.value = response.total
    pagination.page = response.page
    pagination.size = response.size
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '获取流水列表失败'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query,
  async () => {
    const state = buildStateFromQuery()
    filters.value = {
      dateRange: state.dateRange,
      keyword: state.keyword,
      finalCategory: state.finalCategory,
      categorySource: state.categorySource,
    }
    pagination.page = state.page
    pagination.size = state.size

    const requiredQueryReady =
      getQueryString(route.query.dateFrom) &&
      getQueryString(route.query.dateTo) &&
      getQueryString(route.query.page) !== undefined &&
      getQueryString(route.query.size) !== undefined

    if (!requiredQueryReady) {
      await router.replace({ query: buildRouteQuery() })
      return
    }

    await loadTransactionsPage()
  },
  { immediate: true },
)

function updateRoute() {
  void router.replace({ query: buildRouteQuery() })
}

function applyFilters() {
  pagination.page = 0
  updateRoute()
}

function resetFilters() {
  filters.value = {
    dateRange: [previousMonthRange.dateFrom, previousMonthRange.dateTo],
    keyword: '',
    finalCategory: '',
    categorySource: '',
  }
  pagination.page = 0
  pagination.size = 20
  updateRoute()
}

function handlePageChange(nextPage: number) {
  pagination.page = Math.max(nextPage - 1, 0)
  updateRoute()
}

function handleSizeChange(nextSize: number) {
  pagination.size = nextSize
  pagination.page = 0
  updateRoute()
}

function openEditDialog(transaction: TransactionSummaryResponse) {
  editingTransaction.value = transaction
  dialogVisible.value = true
}

async function handleSaveCategory(finalCategory: string) {
  if (!editingTransaction.value) {
    return
  }

  saveLoading.value = true

  try {
    await updateTransactionCategory(editingTransaction.value.id, { finalCategory })
    ElMessage.success('分类修正已保存')
    dialogVisible.value = false
    await loadTransactionsPage()
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '保存分类修正失败'
  } finally {
    saveLoading.value = false
  }
}
</script>

<template>
  <div class="sf-page transactions-view">
    <section class="sf-card sf-page-hero transactions-view__hero">
      <div class="sf-page-hero__eyebrow">Transactions / A2-42</div>
      <h1 class="sf-page-hero__title">流水筛选与分类修正台</h1>
      <p class="sf-page-hero__copy">
        面向联调期的流水检索页面，支持默认上月时间范围、查询参数回写到路由 query、疑似重复提示，以及人工分类修正。
      </p>
      <div class="sf-page-hero__actions">
        <span class="sf-code-chip">{{ currentRangeText }}</span>
        <el-button plain :icon="RefreshRight" @click="loadTransactionsPage()">重新加载</el-button>
      </div>
    </section>

    <section class="sf-card-grid sf-card-grid--4">
      <MetricCard title="记录总数" :value="String(total)" hint="来自分页返回 total" accent="primary" />
      <MetricCard title="人工修正" :value="String(manualCount)" hint="当前页 categorySource = MANUAL" accent="accent" />
      <MetricCard title="未分类" :value="String(unclassifiedCount)" hint="当前页 categorySource = UNCLASSIFIED" accent="danger" />
      <MetricCard title="疑似重复" :value="String(duplicateCount)" hint="当前页 suspectedDuplicate 数量" accent="success" />
    </section>

    <TransactionFilterPanel
      v-model="filters"
      :loading="loading"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <section class="sf-card sf-panel transactions-view__table-panel">
      <div class="transactions-view__table-header">
        <div>
          <h2 class="sf-section-title">流水明细</h2>
          <div class="sf-inline-note">分页使用接口返回值，UI 展示为 1 基页码，内部查询保持与接口一致。</div>
        </div>
      </div>

      <el-alert v-if="error" type="error" :closable="false" :title="error" show-icon />

      <div v-if="!loading && transactions.length === 0" class="sf-data-empty">
        当前筛选条件下没有流水记录，请调整时间范围、关键词或分类条件。
      </div>

      <template v-else>
        <el-table :data="transactions" :loading="loading" stripe class="transactions-view__table">
          <el-table-column label="日期" min-width="118">
            <template #default="{ row }">
              {{ formatDate(row.transactionDate) }}
            </template>
          </el-table-column>

          <el-table-column label="商户 / 摘要" min-width="220">
            <template #default="{ row }">
              <div class="transactions-view__merchant">{{ row.merchantName || '--' }}</div>
              <div class="sf-inline-note">{{ row.summary || '无补充摘要' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="方向" min-width="92">
            <template #default="{ row }">
              {{ directionLabel(row.direction) }}
            </template>
          </el-table-column>

          <el-table-column label="金额" min-width="128" align="right">
            <template #default="{ row }">
              <span :class="row.direction === 'INCOME' ? 'sf-money-positive' : 'sf-money-negative'">
                {{ formatMoney(row.amount) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="分类" min-width="204">
            <template #default="{ row }">
              <div class="transactions-view__merchant">{{ row.finalCategory || row.autoCategory || '--' }}</div>
              <div class="sf-inline-note">自动：{{ row.autoCategory || '--' }}</div>
            </template>
          </el-table-column>

          <el-table-column label="来源" min-width="116">
            <template #default="{ row }">
              <StatusTag mode="source" :value="row.categorySource" />
            </template>
          </el-table-column>

          <el-table-column label="重复提示" min-width="120">
            <template #default="{ row }">
              <StatusTag mode="duplicate" :value="row.suspectedDuplicate ? 'YES' : 'NO'" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" :icon="EditPen" @click="openEditDialog(row)">
                修正分类
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="transactions-view__pagination">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page="pagination.page + 1"
            :page-size="pagination.size"
            :total="total"
            :page-sizes="[10, 20, 50]"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </template>
    </section>

    <TransactionCategoryDialog
      v-model:visible="dialogVisible"
      :transaction="editingTransaction"
      :loading="saveLoading"
      @save="handleSaveCategory"
    />
  </div>
</template>

<style scoped>
.transactions-view__hero {
  background:
    radial-gradient(circle at 20% 20%, rgba(183, 138, 77, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(242, 235, 224, 0.98));
}

.transactions-view__table-panel {
  display: grid;
  gap: 18px;
}

.transactions-view__table-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.transactions-view__table {
  width: 100%;
}

.transactions-view__pagination {
  display: flex;
  justify-content: flex-end;
}

.transactions-view__merchant {
  font-weight: 700;
  color: var(--sf-text);
}

@media (max-width: 960px) {
  .transactions-view__pagination {
    justify-content: flex-start;
  }
}
</style>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { categorySourceOptions } from '@/constants/options'
import type { CategorySource } from '@/types/shared'
import type { BudgetViewQuery } from '@/views/budgets/types'

const props = withDefaults(
  defineProps<{
    modelValue: BudgetViewQuery
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  apply: [BudgetViewQuery]
  reset: []
}>()

const form = reactive<{
  budgetMonth: string
  dateRange: [string, string]
  finalCategory: string
  categorySource?: CategorySource
  keyword: string
  size: number
}>({
  budgetMonth: '',
  dateRange: ['', ''],
  finalCategory: '',
  categorySource: undefined,
  keyword: '',
  size: 10,
})

watch(
  () => props.modelValue,
  (value) => {
    form.budgetMonth = value.budgetMonth.slice(0, 7)
    form.dateRange = [value.dateFrom ?? '', value.dateTo ?? '']
    form.finalCategory = value.finalCategory ?? ''
    form.categorySource = value.categorySource
    form.keyword = value.keyword ?? ''
    form.size = value.size
  },
  { deep: true, immediate: true },
)

function submit() {
  emit('apply', {
    budgetMonth: form.budgetMonth ? `${form.budgetMonth}-01` : props.modelValue.budgetMonth,
    page: 1,
    size: form.size,
    dateFrom: form.dateRange[0] || undefined,
    dateTo: form.dateRange[1] || undefined,
    finalCategory: form.finalCategory.trim() || undefined,
    categorySource: form.categorySource || undefined,
    keyword: form.keyword.trim() || undefined,
  })
}
</script>

<template>
  <section class="sf-panel sf-card">
    <div class="sf-section-title">查看条件</div>

    <el-form label-position="top">
      <div class="sf-filter-grid">
        <el-form-item label="预算月份">
          <el-date-picker
            v-model="form.budgetMonth"
            type="month"
            placeholder="选择预算月份"
            value-format="YYYY-MM"
          />
        </el-form-item>

        <el-form-item label="统计范围">
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-input v-model="form.finalCategory" clearable placeholder="按分类名称筛选" />
        </el-form-item>

        <el-form-item label="分类方式">
          <el-select v-model="form.categorySource" clearable placeholder="全部方式">
            <el-option
              v-for="option in categorySourceOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input v-model="form.keyword" clearable placeholder="搜索商户或备注" />
        </el-form-item>

        <el-form-item label="每页条数">
          <el-select v-model="form.size">
            <el-option :value="5" label="5 条" />
            <el-option :value="10" label="10 条" />
            <el-option :value="20" label="20 条" />
          </el-select>
        </el-form-item>
      </div>

      <div class="sf-toolbar budget-filters__actions">
        <el-button type="primary" :icon="Search" :loading="loading" @click="submit">查看结果</el-button>
        <el-button plain @click="$emit('reset')">恢复默认</el-button>
      </div>
    </el-form>
  </section>
</template>

<style scoped>
.budget-filters__actions {
  justify-content: flex-start;
  margin-top: 8px;
}

:deep(.el-form-item__content) {
  min-width: 0;
}

:deep(.el-date-editor),
:deep(.el-select),
:deep(.el-input) {
  width: 100%;
}

:deep(.el-date-editor--daterange) {
  max-width: 100%;
}
</style>

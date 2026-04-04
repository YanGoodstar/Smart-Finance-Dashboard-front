<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { categorySourceOptions } from '@/constants/options'
import type { DashboardQuery } from '@/types/dashboard'
import type { CategorySource } from '@/types/shared'

const props = withDefaults(
  defineProps<{
    modelValue: DashboardQuery
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  apply: [DashboardQuery]
  reset: []
}>()

const form = reactive<{
  dateRange: [string, string]
  finalCategory: string
  categorySource?: CategorySource
  keyword: string
  size: number
}>({
  dateRange: ['', ''],
  finalCategory: '',
  categorySource: undefined,
  keyword: '',
  size: 10,
})

watch(
  () => props.modelValue,
  (value) => {
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
    <div class="sf-section-title">筛选条件</div>

    <el-form label-position="top">
      <div class="sf-filter-grid">
        <el-form-item label="日期范围">
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

        <el-form-item label="最终分类">
          <el-input v-model="form.finalCategory" clearable placeholder="例如：餐饮、交通、房租" />
        </el-form-item>

        <el-form-item label="分类来源">
          <el-select v-model="form.categorySource" clearable placeholder="全部来源">
            <el-option
              v-for="option in categorySourceOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input v-model="form.keyword" clearable placeholder="按商户、摘要模糊过滤" />
        </el-form-item>

        <el-form-item label="每页条数">
          <el-select v-model="form.size">
            <el-option :value="5" label="5 条" />
            <el-option :value="10" label="10 条" />
            <el-option :value="20" label="20 条" />
          </el-select>
        </el-form-item>
      </div>

      <div class="sf-toolbar dashboard-filters__actions">
        <el-button type="primary" :icon="Search" :loading="loading" @click="submit">应用筛选</el-button>
        <el-button plain @click="$emit('reset')">恢复默认</el-button>
        <span class="sf-inline-note">默认使用上月范围，`page/size/dateFrom/dateTo` 会与路由 query 保持同步。</span>
      </div>
    </el-form>
  </section>
</template>

<style scoped>
.dashboard-filters__actions {
  justify-content: space-between;
  margin-top: 8px;
}

@media (max-width: 900px) {
  .dashboard-filters__actions {
    justify-content: flex-start;
  }
}
</style>

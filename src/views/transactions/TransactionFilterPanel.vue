<script setup lang="ts">
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import { categorySourceOptions } from '@/constants/options'
import type { CategorySource } from '@/types/shared'

type TransactionFilterModel = {
  dateRange: [string, string]
  keyword: string
  finalCategory: string
  categorySource: CategorySource | ''
}

defineProps<{
  loading?: boolean
}>()

const model = defineModel<TransactionFilterModel>({ required: true })
const emit = defineEmits<{
  apply: []
  reset: []
}>()
</script>

<template>
  <section class="sf-card sf-panel filter-panel">
    <div class="filter-panel__header">
      <div>
        <h2 class="sf-section-title">交易筛选</h2>
        <div class="sf-inline-note">使用冻结的 `page / size / dateFrom / dateTo / finalCategory / categorySource / keyword` 语义。</div>
      </div>
      <div class="sf-inline-note">默认范围：上月</div>
    </div>

    <div class="sf-filter-grid">
      <label class="filter-panel__label filter-panel__label--wide">
        时间范围
        <el-date-picker
          v-model="model.dateRange"
          type="daterange"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </label>

      <label class="filter-panel__label">
        关键词
        <el-input
          v-model="model.keyword"
          placeholder="商户名、摘要关键字"
          clearable
          @keyup.enter="emit('apply')"
        />
      </label>

      <label class="filter-panel__label">
        最终分类
        <el-input
          v-model="model.finalCategory"
          placeholder="例如：餐饮、交通、工资"
          clearable
          @keyup.enter="emit('apply')"
        />
      </label>

      <label class="filter-panel__label">
        分类来源
        <el-select v-model="model.categorySource" placeholder="全部来源" clearable>
          <el-option label="全部来源" value="" />
          <el-option
            v-for="option in categorySourceOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </label>
    </div>

    <div class="filter-panel__actions">
      <el-button type="primary" :icon="Search" :loading="loading" @click="emit('apply')">查询流水</el-button>
      <el-button :icon="RefreshLeft" :disabled="loading" @click="emit('reset')">恢复默认</el-button>
    </div>
  </section>
</template>

<style scoped>
.filter-panel {
  display: grid;
  gap: 18px;
}

.filter-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.filter-panel__label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.filter-panel__label--wide {
  grid-column: span 2;
}

.filter-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 960px) {
  .filter-panel__header {
    flex-direction: column;
  }

  .filter-panel__label--wide {
    grid-column: auto;
  }
}
</style>

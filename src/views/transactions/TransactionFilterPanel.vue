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
        <h2 class="sf-section-title">筛选条件</h2>
        <div class="sf-inline-note">按时间、关键词和分类范围缩小结果。</div>
      </div>
      <div class="sf-inline-note">默认展示最近一个月</div>
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
          placeholder="例如：餐饮、交通、工资收入"
          clearable
          @keyup.enter="emit('apply')"
        />
      </label>

      <label class="filter-panel__label">
        分类状态
        <el-select v-model="model.categorySource" placeholder="全部状态" clearable>
          <el-option label="全部状态" value="" />
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

.filter-panel :deep(.el-date-editor.el-input__wrapper),
.filter-panel :deep(.el-date-editor.el-range-editor),
.filter-panel :deep(.el-select),
.filter-panel :deep(.el-input) {
  width: 100%;
}

.filter-panel__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 960px) {
  .filter-panel__header {
    flex-direction: column;
  }

  .filter-panel__label--wide {
    grid-column: auto;
  }

  .filter-panel__actions {
    justify-content: stretch;
  }

  .filter-panel__actions :deep(.el-button) {
    flex: 1 1 0;
  }
}
</style>

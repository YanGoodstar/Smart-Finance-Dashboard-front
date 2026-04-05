<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshRight } from '@element-plus/icons-vue'
import MetricCard from '@/components/MetricCard.vue'
import { createRule, deleteRule, listRules, updateRule } from '@/api/rules'
import type { CategoryRuleResponse, CategoryRuleSaveRequest } from '@/types/rule'
import { formatDate } from '@/utils/format'
import RuleEditorDialog from '@/views/rules/RuleEditorDialog.vue'

type RuleFilterMode = 'ALL' | 'ENABLED' | 'DISABLED'

const filterMode = ref<RuleFilterMode>('ALL')
const loading = ref(false)
const saveLoading = ref(false)
const error = ref('')
const rules = ref<CategoryRuleResponse[]>([])
const dialogVisible = ref(false)
const editingRule = ref<CategoryRuleResponse | null>(null)

const enabledCount = computed(() => rules.value.filter((rule) => rule.enabled).length)
const disabledCount = computed(() => rules.value.filter((rule) => !rule.enabled).length)
const highestPriority = computed(() => {
  if (rules.value.length === 0) {
    return '--'
  }
  return String(Math.min(...rules.value.map((rule) => rule.priority)))
})

const filterSummary = computed(() => {
  switch (filterMode.value) {
    case 'ENABLED':
      return '当前仅查看启用规则'
    case 'DISABLED':
      return '当前仅查看停用规则'
    default:
      return '当前查看全部规则'
  }
})

onMounted(() => {
  void loadRuleList()
})

function resolveEnabledFilter() {
  if (filterMode.value === 'ENABLED') {
    return true
  }
  if (filterMode.value === 'DISABLED') {
    return false
  }
  return undefined
}

async function loadRuleList() {
  loading.value = true
  error.value = ''

  try {
    const response = await listRules(resolveEnabledFilter())
    rules.value = response.items
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '获取规则列表失败'
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingRule.value = null
  dialogVisible.value = true
}

function openEditDialog(rule: CategoryRuleResponse) {
  editingRule.value = rule
  dialogVisible.value = true
}

async function handleSave(payload: CategoryRuleSaveRequest) {
  saveLoading.value = true

  try {
    if (editingRule.value) {
      await updateRule(editingRule.value.id, payload)
      ElMessage.success('规则已更新')
    } else {
      await createRule(payload)
      ElMessage.success('规则已创建')
    }

    dialogVisible.value = false
    await loadRuleList()
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '保存规则失败'
  } finally {
    saveLoading.value = false
  }
}

async function handleDelete(rule: CategoryRuleResponse) {
  await ElMessageBox.confirm(
    `确认删除规则「${rule.ruleName}」吗？删除后需要重新创建才能恢复。`,
    '删除规则',
    {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    },
  )

  try {
    await deleteRule(rule.id)
    ElMessage.success('规则已删除')
    await loadRuleList()
  } catch (requestError) {
    error.value = requestError instanceof Error ? requestError.message : '删除规则失败'
  }
}
</script>

<template>
  <div class="sf-page rules-view">
    <section class="sf-card sf-page-hero rules-view__hero">
      <div class="sf-page-hero__eyebrow">分类规则</div>
      <h1 class="sf-page-hero__title">让分类更贴近你的习惯</h1>
      <p class="sf-page-hero__copy">
        在这里整理常用规则，控制哪些匹配方式启用，并随时新增、修改或删除规则。
      </p>
      <div class="sf-page-hero__actions rules-view__hero-actions">
        <span class="rules-view__hero-note">{{ filterSummary }}</span>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增规则</el-button>
        <el-button plain :icon="RefreshRight" @click="loadRuleList()">刷新列表</el-button>
      </div>
    </section>

    <section class="sf-card-grid sf-card-grid--4">
      <MetricCard title="当前规则" :value="String(rules.length)" hint="正在显示的规则数量" accent="primary" />
      <MetricCard title="启用中" :value="String(enabledCount)" hint="会参与自动分类的规则" accent="success" />
      <MetricCard title="已停用" :value="String(disabledCount)" hint="暂时不会参与分类" accent="danger" />
      <MetricCard title="优先顺位" :value="highestPriority" hint="数字越小，越会优先匹配" accent="accent" />
    </section>

    <section class="sf-card sf-panel rules-view__toolbar">
      <div>
        <h2 class="sf-section-title">规则过滤</h2>
        <div class="sf-inline-note">按启用状态快速整理规则列表。</div>
      </div>

      <el-radio-group v-model="filterMode" @change="loadRuleList()">
        <el-radio-button label="ALL">全部</el-radio-button>
        <el-radio-button label="ENABLED">仅启用</el-radio-button>
        <el-radio-button label="DISABLED">仅停用</el-radio-button>
      </el-radio-group>
    </section>

    <section class="sf-card sf-panel rules-view__table-panel">
      <el-alert v-if="error" type="error" :closable="false" :title="error" show-icon />

      <div v-if="!loading && rules.length === 0" class="sf-data-empty">
        当前筛选下还没有规则，可以先新增一条常用匹配规则。
      </div>

      <div v-else class="rules-view__table-wrap">
        <el-table :data="rules" :loading="loading" stripe class="rules-view__table">
          <el-table-column label="规则名称" min-width="180">
            <template #default="{ row }">
              <div class="rules-view__name">{{ row.ruleName }}</div>
            </template>
          </el-table-column>

          <el-table-column label="匹配内容" min-width="260">
            <template #default="{ row }">
              <div class="rules-view__expression">{{ row.matchExpression }}</div>
            </template>
          </el-table-column>

          <el-table-column label="目标分类" min-width="140">
            <template #default="{ row }">
              <span class="sf-code-chip">{{ row.targetCategory }}</span>
            </template>
          </el-table-column>

          <el-table-column label="优先级" min-width="100" align="center">
            <template #default="{ row }">
              {{ row.priority }}
            </template>
          </el-table-column>

          <el-table-column label="状态" min-width="108">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'" effect="dark" round>
                {{ row.enabled ? '已启用' : '已停用' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="最近更新" min-width="160">
            <template #default="{ row }">
              {{ formatDate(row.updatedAt, true) }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="156" fixed="right">
            <template #default="{ row }">
              <div class="rules-view__actions">
                <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
                <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>

    <RuleEditorDialog
      v-model:visible="dialogVisible"
      :rule="editingRule"
      :loading="saveLoading"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.rules-view__hero {
  background:
    radial-gradient(circle at bottom left, rgba(23, 57, 89, 0.16), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(244, 237, 228, 0.98));
}

.rules-view__toolbar {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
}

.rules-view__table-panel {
  display: grid;
  gap: 16px;
}

.rules-view__table {
  width: 100%;
}

.rules-view__table-wrap {
  overflow-x: auto;
}

.rules-view__table-wrap :deep(.el-table) {
  min-width: 980px;
}

.rules-view__hero-actions {
  align-items: center;
}

.rules-view__hero-note {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
  color: var(--sf-primary);
  font-weight: 600;
}

.rules-view__name {
  font-weight: 700;
  color: var(--sf-text);
}

.rules-view__expression {
  line-height: 1.7;
  color: var(--sf-text-muted);
  white-space: pre-wrap;
  word-break: break-word;
}

.rules-view__actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 960px) {
  .rules-view__toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .rules-view__toolbar :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

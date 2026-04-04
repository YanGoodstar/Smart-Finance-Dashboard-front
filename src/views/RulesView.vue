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
      <div class="sf-page-hero__eyebrow">Rules / A2-43</div>
      <h1 class="sf-page-hero__title">分类规则管理台</h1>
      <p class="sf-page-hero__copy">
        负责规则列表浏览、启用状态过滤，以及规则的新增、编辑、删除。所有写操作都通过既有规则 API 契约完成。
      </p>
      <div class="sf-page-hero__actions">
        <span class="sf-code-chip">{{ filterSummary }}</span>
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">新增规则</el-button>
        <el-button plain :icon="RefreshRight" @click="loadRuleList()">刷新列表</el-button>
      </div>
    </section>

    <section class="sf-card-grid sf-card-grid--4">
      <MetricCard title="规则总数" :value="String(rules.length)" hint="基于当前过滤后的列表结果" accent="primary" />
      <MetricCard title="启用中" :value="String(enabledCount)" hint="enabled = true" accent="success" />
      <MetricCard title="已停用" :value="String(disabledCount)" hint="enabled = false" accent="danger" />
      <MetricCard title="最高优先级" :value="highestPriority" hint="数值越小优先级越高" accent="accent" />
    </section>

    <section class="sf-card sf-panel rules-view__toolbar">
      <div>
        <h2 class="sf-section-title">规则过滤</h2>
        <div class="sf-inline-note">切换视图后会重新请求规则列表，避免前端本地过滤与后端状态不一致。</div>
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
        当前过滤条件下没有规则，可以先创建一条分类规则开始联调。
      </div>

      <el-table v-else :data="rules" :loading="loading" stripe class="rules-view__table">
        <el-table-column label="规则名称" min-width="180">
          <template #default="{ row }">
            <div class="rules-view__name">{{ row.ruleName }}</div>
            <div class="sf-inline-note">#{{ row.id }}</div>
          </template>
        </el-table-column>

        <el-table-column label="匹配表达式" min-width="260">
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

        <el-table-column label="更新时间" min-width="160">
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
}

.rules-view__table-panel {
  display: grid;
  gap: 16px;
}

.rules-view__table {
  width: 100%;
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
}
</style>

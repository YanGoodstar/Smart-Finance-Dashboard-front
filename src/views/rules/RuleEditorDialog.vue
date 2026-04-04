<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CategoryRuleResponse, CategoryRuleSaveRequest } from '@/types/rule'

const props = withDefaults(
  defineProps<{
    visible: boolean
    loading?: boolean
    rule?: CategoryRuleResponse | null
  }>(),
  {
    loading: false,
    rule: null,
  },
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [payload: CategoryRuleSaveRequest]
}>()

const formRef = ref<FormInstance>()
const form = reactive<CategoryRuleSaveRequest>({
  ruleName: '',
  matchExpression: '',
  targetCategory: '',
  priority: 100,
  enabled: true,
})

const dialogTitle = computed(() => (props.rule ? `编辑规则 · #${props.rule.id}` : '新增分类规则'))

const rules: FormRules<typeof form> = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  matchExpression: [{ required: true, message: '请输入匹配表达式', trigger: 'blur' }],
  targetCategory: [{ required: true, message: '请输入目标分类', trigger: 'blur' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'change' }],
}

watch(
  () => [props.visible, props.rule] as const,
  () => {
    form.ruleName = props.rule?.ruleName ?? ''
    form.matchExpression = props.rule?.matchExpression ?? ''
    form.targetCategory = props.rule?.targetCategory ?? ''
    form.priority = props.rule?.priority ?? 100
    form.enabled = props.rule?.enabled ?? true
    formRef.value?.clearValidate()
  },
  { immediate: true },
)

function closeDialog() {
  emit('update:visible', false)
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  emit('save', {
    ruleName: form.ruleName.trim(),
    matchExpression: form.matchExpression.trim(),
    targetCategory: form.targetCategory.trim(),
    priority: form.priority,
    enabled: form.enabled,
  })
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="620px"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="rule-dialog__form">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="form.ruleName" placeholder="例如：早餐商户识别" maxlength="32" show-word-limit />
      </el-form-item>

      <el-form-item label="匹配表达式" prop="matchExpression">
        <el-input
          v-model="form.matchExpression"
          type="textarea"
          :rows="4"
          placeholder="填写用于匹配流水摘要或商户名的表达式"
        />
      </el-form-item>

      <div class="rule-dialog__grid">
        <el-form-item label="目标分类" prop="targetCategory">
          <el-input v-model="form.targetCategory" placeholder="例如：餐饮" maxlength="24" show-word-limit />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="form.priority" :min="1" :max="9999" controls-position="right" />
        </el-form-item>
      </div>

      <el-form-item label="启用状态">
        <el-switch v-model="form.enabled" inline-prompt active-text="启用" inactive-text="停用" />
      </el-form-item>

      <div class="sf-inline-note">
        规则保存后会进入共享规则列表，由后端按优先级和匹配表达式参与自动分类。
      </div>
    </el-form>

    <template #footer>
      <div class="rule-dialog__footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">保存规则</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.rule-dialog__form {
  display: grid;
  gap: 8px;
}

.rule-dialog__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
}

.rule-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 720px) {
  .rule-dialog__grid {
    grid-template-columns: 1fr;
  }
}
</style>

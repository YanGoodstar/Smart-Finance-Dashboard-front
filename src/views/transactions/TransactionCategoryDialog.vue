<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { TransactionSummaryResponse } from '@/types/shared'
import { formatDate, formatMoney } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    visible: boolean
    transaction?: TransactionSummaryResponse | null
    loading?: boolean
  }>(),
  {
    transaction: null,
    loading: false,
  },
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  save: [finalCategory: string]
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  finalCategory: '',
})

const rules: FormRules<typeof form> = {
  finalCategory: [
    { required: true, message: '请输入修正后的分类名称', trigger: 'blur' },
    { min: 1, max: 32, message: '分类名称长度需在 1 到 32 个字符之间', trigger: 'blur' },
  ],
}

const dialogTitle = computed(() => '调整分类')

watch(
  () => [props.visible, props.transaction] as const,
  () => {
    form.finalCategory = props.transaction?.finalCategory ?? props.transaction?.autoCategory ?? ''
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
  emit('save', form.finalCategory.trim())
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="540px"
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div v-if="transaction" class="dialog__meta">
      <div class="sf-kv-item">
        <span class="sf-kv-item__label">交易日期</span>
        <span class="sf-kv-item__value">{{ formatDate(transaction.transactionDate) }}</span>
      </div>
      <div class="sf-kv-item">
        <span class="sf-kv-item__label">商户 / 摘要</span>
        <span class="sf-kv-item__value">{{ transaction.merchantName || transaction.summary || '--' }}</span>
      </div>
      <div class="sf-kv-item">
        <span class="sf-kv-item__label">交易金额</span>
        <span class="sf-kv-item__value">{{ formatMoney(transaction.amount) }}</span>
      </div>
      <div class="sf-kv-item">
        <span class="sf-kv-item__label">自动分类</span>
        <span class="sf-kv-item__value">{{ transaction.autoCategory || '--' }}</span>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="dialog__form">
      <el-form-item label="最终分类" prop="finalCategory">
        <el-input v-model="form.finalCategory" placeholder="请输入新的分类名称" maxlength="32" show-word-limit />
      </el-form-item>
      <div class="sf-inline-note">
        保存后，这笔流水会按你选择的分类显示。
      </div>
    </el-form>

    <template #footer>
      <div class="dialog__footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">保存修正</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog__meta {
  display: grid;
  gap: 10px;
  margin-bottom: 18px;
}

.dialog__form {
  display: grid;
  gap: 8px;
}

.dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .dialog__footer :deep(.el-button) {
    flex: 1 1 0;
  }
}
</style>

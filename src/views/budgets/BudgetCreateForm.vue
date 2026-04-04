<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { BudgetSaveRequest } from '@/types/budget'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    defaultBudgetMonth: string
    submitting?: boolean
  }>(),
  {
    submitting: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [boolean]
  submit: [BudgetSaveRequest]
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  budgetMonth: '',
  categoryMode: 'TOTAL' as 'TOTAL' | 'CATEGORY',
  category: '',
  amount: undefined as number | undefined,
})

const rules: FormRules<typeof form> = {
  budgetMonth: [{ required: true, message: '请选择预算月份', trigger: 'change' }],
  category: [
    {
      validator: (_rule, value, callback) => {
        if (form.categoryMode === 'CATEGORY' && !String(value ?? '').trim()) {
          callback(new Error('请输入分类名称'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  amount: [
    { required: true, message: '请输入预算金额', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (Number(value) > 0) {
          callback()
          return
        }
        callback(new Error('预算金额必须大于 0'))
      },
      trigger: 'blur',
    },
  ],
}

function resetForm(defaultMonth = props.defaultBudgetMonth) {
  form.budgetMonth = defaultMonth.slice(0, 7)
  form.categoryMode = 'TOTAL'
  form.category = ''
  form.amount = undefined
  formRef.value?.clearValidate()
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      resetForm()
    }
  },
  { immediate: true },
)

watch(
  () => props.defaultBudgetMonth,
  (value) => {
    if (!props.modelValue) {
      resetForm(value)
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  emit('submit', {
    budgetMonth: `${form.budgetMonth}-01`,
    category: form.categoryMode === 'TOTAL' ? null : form.category.trim(),
    amount: Number(form.amount),
  })
}
</script>

<template>
  <el-dialog :model-value="modelValue" title="新建预算" width="560px" @close="close">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item label="预算月份" prop="budgetMonth">
        <el-date-picker
          v-model="form.budgetMonth"
          type="month"
          placeholder="选择预算月份"
          value-format="YYYY-MM"
        />
      </el-form-item>

      <el-form-item label="预算类型">
        <el-radio-group v-model="form.categoryMode">
          <el-radio-button label="TOTAL">总预算</el-radio-button>
          <el-radio-button label="CATEGORY">分类预算</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="form.categoryMode === 'CATEGORY'" label="分类名称" prop="category">
        <el-input v-model="form.category" clearable placeholder="例如：餐饮、交通、房租" />
      </el-form-item>

      <el-form-item label="预算金额" prop="amount">
        <el-input-number v-model="form.amount" :min="0" :precision="2" :step="100" style="width: 100%" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="budget-create-form__footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存预算</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.budget-create-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

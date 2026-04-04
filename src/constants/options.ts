import type { ImportSourceType } from '@/types/import-job'
import type { BudgetWarningLevel, CategorySource } from '@/types/shared'

export const categorySourceOptions: Array<{ label: string; value: CategorySource }> = [
  { label: '自动分类', value: 'AUTO' },
  { label: '人工修正', value: 'MANUAL' },
  { label: '未分类', value: 'UNCLASSIFIED' },
]

export const importSourceOptions: Array<{ label: string; value: ImportSourceType }> = [
  { label: '支付宝 CSV', value: 'ALIPAY_CSV' },
  { label: '微信 CSV', value: 'WECHAT_CSV' },
]

export const warningLevelOptions: Array<{ label: string; value: BudgetWarningLevel }> = [
  { label: '正常', value: 'NORMAL' },
  { label: '接近预算', value: 'NEAR_LIMIT' },
  { label: '超预算', value: 'OVER_BUDGET' },
]

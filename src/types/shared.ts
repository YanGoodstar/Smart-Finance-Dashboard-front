export type TransactionDirection = 'INCOME' | 'EXPENSE'
export type CategorySource = 'AUTO' | 'MANUAL' | 'UNCLASSIFIED'
export type BudgetWarningLevel = 'NORMAL' | 'NEAR_LIMIT' | 'OVER_BUDGET'

export interface TransactionSummaryResponse {
  id: number
  transactionDate: string
  amount: string
  direction: TransactionDirection
  merchantName: string | null
  summary: string | null
  autoCategory: string | null
  finalCategory: string | null
  categorySource: CategorySource
  suspectedDuplicate: boolean
}

export interface TransactionPageResponse {
  items: TransactionSummaryResponse[]
  total: number
  page: number
  size: number
}

export interface TransactionQuery {
  page: number
  size: number
  dateFrom?: string
  dateTo?: string
  finalCategory?: string
  categorySource?: CategorySource
  keyword?: string
}

export interface UpdateTransactionCategoryRequest {
  finalCategory: string
}

export interface UpdateTransactionCategoryResponse {
  transactionId: number
  finalCategory: string
  categorySource: CategorySource
}

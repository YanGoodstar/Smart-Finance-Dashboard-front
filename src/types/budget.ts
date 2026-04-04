import type { BudgetWarningLevel, CategorySource } from './shared'

export interface BudgetResponse {
  id: number
  budgetMonth: string
  category: string | null
  amount: string
  createdAt: string
  updatedAt: string
}

export interface BudgetListResponse {
  items: BudgetResponse[]
}

export interface BudgetSaveRequest {
  budgetMonth: string
  category: string | null
  amount: number
}

export interface BudgetCategoryProgressResponse {
  category: string | null
  budgetAmount: string
  actualSpent: string
  remainingAmount: string
  usageRate: string
  warningLevel: BudgetWarningLevel | null
}

export interface BudgetProgressResponse {
  budgetMonth: string
  totalBudget: string
  totalSpent: string
  totalRemaining: string
  usageRate: string
  configured: boolean
  warningLevel: BudgetWarningLevel | null
  items: BudgetCategoryProgressResponse[]
  total: number
  page: number
  size: number
}

export interface BudgetProgressQuery {
  budgetMonth?: string
  page: number
  size: number
  dateFrom?: string
  dateTo?: string
  finalCategory?: string
  categorySource?: CategorySource
  keyword?: string
}

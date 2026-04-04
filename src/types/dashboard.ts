import type { BudgetWarningLevel, CategorySource, TransactionPageResponse } from './shared'

export interface DashboardSummaryResponse {
  transactionCount: number
  totalIncome: string
  totalExpense: string
  netAmount: string
}

export interface DashboardCategoryBreakdownResponse {
  finalCategory: string
  totalExpense: string
  transactionCount: number
}

export interface DashboardTrendPointResponse {
  date: string
  incomeAmount: string
  expenseAmount: string
  netAmount: string
}

export interface DashboardBudgetAlertResponse {
  configured: boolean
  warningLevel: BudgetWarningLevel | null
  budgetAmount: string | null
  spentAmount: string
  remainingAmount: string | null
  usageRate: string | null
}

export interface DashboardUnclassifiedSummaryResponse {
  hasUnclassified: boolean
  transactionCount: number
  incomeAmount: string
  expenseAmount: string
}

export interface DashboardOverviewResponse {
  summary: DashboardSummaryResponse
  categoryBreakdowns: DashboardCategoryBreakdownResponse[]
  recentTransactions: TransactionPageResponse
  trendPoints: DashboardTrendPointResponse[]
  budgetAlert: DashboardBudgetAlertResponse
  unclassifiedSummary: DashboardUnclassifiedSummaryResponse
}

export interface DashboardQuery {
  page: number
  size: number
  dateFrom?: string
  dateTo?: string
  finalCategory?: string
  categorySource?: CategorySource
  keyword?: string
}

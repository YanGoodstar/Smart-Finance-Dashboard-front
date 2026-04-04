import type {
  BudgetListResponse,
  BudgetProgressQuery,
  BudgetProgressResponse,
  BudgetResponse,
  BudgetSaveRequest,
} from '@/types/budget'
import { request } from './client'

export function createBudget(payload: BudgetSaveRequest) {
  return request<BudgetResponse>({
    url: '/budgets',
    method: 'POST',
    data: payload,
  })
}

export function listBudgets(budgetMonth?: string) {
  return request<BudgetListResponse>({
    url: '/budgets',
    method: 'GET',
    params: budgetMonth ? { budgetMonth } : {},
  })
}

export function getBudgetProgress(params: BudgetProgressQuery) {
  return request<BudgetProgressResponse>({
    url: '/budgets/progress',
    method: 'GET',
    params,
  })
}

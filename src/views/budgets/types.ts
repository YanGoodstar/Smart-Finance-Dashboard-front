import type { BudgetProgressQuery } from '@/types/budget'

export interface BudgetViewQuery extends BudgetProgressQuery {
  budgetMonth: string
}

import type {
  TransactionPageResponse,
  TransactionQuery,
  UpdateTransactionCategoryRequest,
  UpdateTransactionCategoryResponse,
} from '@/types/shared'
import { request } from './client'

export function listTransactions(params: TransactionQuery) {
  return request<TransactionPageResponse>({
    url: '/transactions',
    method: 'GET',
    params,
  })
}

export function updateTransactionCategory(transactionId: number, payload: UpdateTransactionCategoryRequest) {
  return request<UpdateTransactionCategoryResponse>({
    url: `/transactions/${transactionId}/category`,
    method: 'PATCH',
    data: payload,
  })
}

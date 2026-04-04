import type { CategoryRuleListResponse, CategoryRuleResponse, CategoryRuleSaveRequest } from '@/types/rule'
import { request } from './client'

export function listRules(enabled?: boolean) {
  return request<CategoryRuleListResponse>({
    url: '/rules',
    method: 'GET',
    params: enabled === undefined ? {} : { enabled },
  })
}

export function getRule(id: number) {
  return request<CategoryRuleResponse>({
    url: `/rules/${id}`,
    method: 'GET',
  })
}

export function createRule(payload: CategoryRuleSaveRequest) {
  return request<CategoryRuleResponse>({
    url: '/rules',
    method: 'POST',
    data: payload,
  })
}

export function updateRule(id: number, payload: CategoryRuleSaveRequest) {
  return request<CategoryRuleResponse>({
    url: `/rules/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export function deleteRule(id: number) {
  return request<void>({
    url: `/rules/${id}`,
    method: 'DELETE',
  })
}

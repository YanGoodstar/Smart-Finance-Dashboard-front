export interface CategoryRuleResponse {
  id: number
  ruleName: string
  matchExpression: string
  targetCategory: string
  priority: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryRuleListResponse {
  items: CategoryRuleResponse[]
}

export interface CategoryRuleSaveRequest {
  ruleName: string
  matchExpression: string
  targetCategory: string
  priority: number
  enabled: boolean
}

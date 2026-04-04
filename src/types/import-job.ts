import type { PagedResponse } from './api'

export type ImportJobStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED'
export type ImportSourceType = 'ALIPAY_CSV' | 'WECHAT_CSV'

export interface ImportJobExecutionResponse {
  startedAt: string | null
  finishedAt: string | null
  running: boolean
  terminal: boolean
}

export interface ImportJobProcessingSummaryResponse {
  totalCount: number
  processedCount: number
  successCount: number
  failedCount: number
  suspectedDuplicateCount: number
  errorSummary: string | null
}

export interface ImportJobResponse {
  id: number
  sourceType: ImportSourceType
  status: ImportJobStatus
  execution: ImportJobExecutionResponse
  processingSummary: ImportJobProcessingSummaryResponse
  createdAt: string
  updatedAt: string
}

export type ImportJobPageResponse = PagedResponse<ImportJobResponse>

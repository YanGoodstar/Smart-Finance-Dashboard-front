import type { ImportJobPageResponse, ImportJobResponse, ImportSourceType } from '@/types/import-job'
import { request, uploadRequest } from './client'

export function uploadImportJob(sourceType: ImportSourceType, file: File) {
  const formData = new FormData()
  formData.append('sourceType', sourceType)
  formData.append('file', file)
  return uploadRequest<ImportJobResponse>('/import-jobs/upload', formData)
}

export function listImportJobs(page = 0, size = 20) {
  return request<ImportJobPageResponse>({
    url: '/import-jobs',
    method: 'GET',
    params: { page, size },
  })
}

export function getImportJob(jobId: number) {
  return request<ImportJobResponse>({
    url: `/import-jobs/${jobId}`,
    method: 'GET',
  })
}

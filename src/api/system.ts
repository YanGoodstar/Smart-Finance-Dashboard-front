import { request } from './client'

export interface HealthResponse {
  status: 'UP' | 'DOWN'
  timestamp: string
}

export function getHealth() {
  return request<HealthResponse>({
    url: '/health',
    method: 'GET',
  })
}

import type { DashboardOverviewResponse, DashboardQuery } from '@/types/dashboard'
import { request } from './client'

export function getDashboardOverview(params: DashboardQuery) {
  return request<DashboardOverviewResponse>({
    url: '/dashboard/overview',
    method: 'GET',
    params,
  })
}

import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  validateStatus: () => true,
})

let activeMessage: string | null = null

function showError(message: string) {
  if (message === activeMessage) {
    return
  }
  activeMessage = message
  ElMessage.error(message)
  window.setTimeout(() => {
    activeMessage = null
  }, 1200)
}

export async function request<T>(config: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
}): Promise<T> {
  try {
    const response = await client.request<ApiResponse<T>>(config)
    const payload = response.data
    if (!payload.success) {
      const message = payload.message || '请求失败'
      showError(message)
      throw new Error(message)
    }
    return payload.data
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.message || '网络异常'
      showError(message)
      throw new Error(message)
    }
    throw error
  }
}

export async function uploadRequest<T>(url: string, formData: FormData): Promise<T> {
  return request<T>({
    url,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

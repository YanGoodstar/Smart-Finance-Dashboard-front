export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
}

export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

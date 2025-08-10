export type ApiError = {
  message: string
  errors?: Record<string, Array<string>>
}

export type ApiResponse<T> = {
  data: T
  message: string
  success: boolean
}

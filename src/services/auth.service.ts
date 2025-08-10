import type { LoginFormData, RegisterFormData } from '@/types/auth.types'
import apiClient from '@/lib/axios'

export const registerUser = async (data: RegisterFormData) => {
  return apiClient.post('/auth/register', data)
}

export const loginUser = async (data: LoginFormData) => {
  return apiClient.post('/auth/login', data)
}

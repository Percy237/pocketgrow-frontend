import type { Contribution } from '@/types/contribution.types'
import apiClient from '@/lib/axios'

export const getContributions = async (): Promise<Array<Contribution>> => {
  const response = await apiClient.get(`/contributions`)
  return response.data
}

export const addContribution = async (data: {
  amount: number
  date: string
}): Promise<Contribution> => {
  return apiClient.post('/contributions', data)
}

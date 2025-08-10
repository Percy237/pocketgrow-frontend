import type {
  AdminContribution,
  ContributionFormData,
  User,
} from '@/types/admin.types'
import apiClient from '@/lib/axios'

export const getUsers = async (): Promise<Array<User>> => {
  const response = await apiClient.get<Array<User>>('/users')
  return response.data
}

export const getAdminContributions = async (): Promise<
  Array<AdminContribution>
> => {
  const url = `/contributions`
  const response = await apiClient.get<Array<AdminContribution>>(url)
  return response.data
}

export const addAdminContribution = async (
  data: ContributionFormData,
): Promise<AdminContribution> => {
  const response = await apiClient.post<AdminContribution>(
    '/contributions',
    data,
  )
  return response.data
}

export const deleteAdminContribution = async (id: string): Promise<void> => {
  await apiClient.delete(`/contributions/${id}`)
}

export const updateAdminContribution = async (
  id: string,
  data: ContributionFormData,
): Promise<AdminContribution> => {
  const response = await apiClient.patch<AdminContribution>(
    `/contributions/${id}`,
    data,
  )
  return response.data
}

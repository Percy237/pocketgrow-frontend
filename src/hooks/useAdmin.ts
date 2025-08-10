import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ContributionFormData } from '@/types/admin.types'
import {
  addAdminContribution,
  deleteAdminContribution,
  getAdminContributions,
  getUsers,
  updateAdminContribution,
} from '@/services/admin.services'

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export const useAdminContributions = () => {
  return useQuery({
    queryKey: ['admin-contributions'],
    queryFn: () => getAdminContributions(),
  })
}

export const useAddAdminContribution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addAdminContribution,
    onSuccess: () => {
      toast.success('Contribution added successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-contributions'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to add contribution')
    },
  })
}

export const useDeleteAdminContribution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminContribution,
    onSuccess: () => {
      toast.success('Contribution deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-contributions'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to delete contribution')
    },
  })
}

export const useUpdateAdminContribution = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContributionFormData }) =>
      updateAdminContribution(id, data),
    onSuccess: () => {
      toast.success('Contribution updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-contributions'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast.error('Failed to update contribution')
    },
  })
}

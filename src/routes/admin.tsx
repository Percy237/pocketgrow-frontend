import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ContributionFormData, User } from '@/types/admin.types'
import { Logo } from '@/assets/images'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useAddAdminContribution,
  useAdminContributions,
  useAdminUsers,
  useDeleteAdminContribution,
  useUpdateAdminContribution,
} from '@/hooks/useAdmin'
import Modal from '@/components/ui/Modal'
import { contributionSchema } from '@/types/admin.types'

export const Route = createFileRoute('/admin')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [editingContribution, setEditingContribution] = useState<any>(null)
  const [deletingContribution, setDeletingContribution] = useState<any>(null)
  const contributionsPerPage = 5
  const { data: users = [], isLoading: usersLoading } = useAdminUsers()
  const { data: contributions = [], isLoading: contributionsLoading } =
    useAdminContributions()
  const addContribution = useAddAdminContribution()
  const deleteContribution = useDeleteAdminContribution()
  const updateContribution = useUpdateAdminContribution()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  })

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    control: editControl,
    formState: { errors: editErrors },
    reset: editReset,
    setValue: setEditValue,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  })

  const onSubmit = (data: ContributionFormData) => {
    addContribution.mutate(data, {
      onSuccess: () => reset(),
    })
  }

  const handleEdit = (contribution: any) => {
    setEditingContribution(contribution)
    // Extract user ID - handle both string and object formats
    const userId =
      typeof contribution.userId === 'string'
        ? contribution.userId
        : contribution.userId._id
    setEditValue('userId', userId)
    setEditValue('amount', contribution.amount)
    setEditValue('date', contribution.date.split('T')[0]) // Format date for input
  }

  const onEditSubmit = (data: ContributionFormData) => {
    if (editingContribution) {
      updateContribution.mutate(
        { id: editingContribution._id, data },
        {
          onSuccess: () => {
            setEditingContribution(null)
            editReset()
          },
        },
      )
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingContribution) {
      deleteContribution.mutate(deletingContribution._id, {
        onSuccess: () => {
          setDeletingContribution(null)
        },
      })
    }
  }

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0)

  const handleUserSelect = (userId: string) => {
    if (selectedUserId === userId) {
      setSelectedUserId(undefined)
    } else {
      setSelectedUserId(userId)
      setCurrentPage(1) // Reset to first page when selecting new user
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-4">
      <div className="relative max-w-4xl w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="PocketGrow Logo" className="h-16 w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm font-medium">
          Manage contributions for PocketGrow colleagues
        </p>

        <div className="bg-indigo-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add Contribution
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Controller
                name="userId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Colleague"
                    placeholder="Select someone"
                    options={users.map((user) => ({
                      value: user._id,
                      label: `${user.name} (${user.email})`,
                    }))}
                    error={errors.userId?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <Input
              id="amount"
              label="Amount (FCFA)"
              type="number"
              step="100"
              min="100"
              placeholder="100"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />
            <Input
              id="date"
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />
            <div className="flex space-x-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={addContribution.isPending}
              >
                {addContribution.isPending ? 'Adding...' : 'Add'}
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gray-300 text-gray-700"
                onClick={() => reset()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Total Contributions
          </h2>
          <p className="text-3xl font-bold text-indigo-600">
            {totalContributions} FCFA
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Combined savings across all colleagues
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Colleagues
          </h2>
          {usersLoading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <div className="space-y-6">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onSelect={() => handleUserSelect(user._id)}
                  isSelected={selectedUserId === user._id}
                  contributions={contributions.filter(
                    (c) => c.userId._id === user._id,
                  )}
                  contributionsLoading={contributionsLoading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  contributionsPerPage={contributionsPerPage}
                  onEdit={handleEdit}
                  onDelete={setDeletingContribution}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Contribution Modal */}
        <Modal
          isOpen={!!editingContribution}
          onClose={() => {
            setEditingContribution(null)
            editReset()
          }}
          title="Edit Contribution"
          size="md"
        >
          <form onSubmit={handleEditSubmit(onEditSubmit)} className="space-y-4">
            <div>
              <Controller
                name="userId"
                control={editControl}
                render={({ field }) => (
                  <Select
                    label="Colleague"
                    placeholder="Select someone"
                    options={users.map((user) => ({
                      value: user._id,
                      label: `${user.name} (${user.email})`,
                    }))}
                    error={editErrors.userId?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <Input
              id="edit-amount"
              label="Amount (FCFA)"
              type="number"
              step="100"
              min="100"
              placeholder="100"
              error={editErrors.amount?.message}
              {...editRegister('amount', { valueAsNumber: true })}
            />
            <Input
              id="edit-date"
              label="Date"
              type="date"
              error={editErrors.date?.message}
              {...editRegister('date')}
            />
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={updateContribution.isPending}
              >
                {updateContribution.isPending ? 'Updating...' : 'Update'}
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={() => {
                  setEditingContribution(null)
                  editReset()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingContribution}
          onClose={() => setDeletingContribution(null)}
          title="Delete Contribution"
          size="sm"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Contribution
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this contribution of{' '}
              <span className="font-semibold">
                {deletingContribution?.amount} FCFA
              </span>{' '}
              from{' '}
              <span className="font-semibold">
                {new Date(deletingContribution?.date).toLocaleDateString()}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteContribution.isPending}
              >
                {deleteContribution.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                onClick={() => setDeletingContribution(null)}
                className="flex-1 bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

function UserCard({
  user,
  onSelect,
  isSelected,
  contributions,
  contributionsLoading,
  currentPage,
  setCurrentPage,
  contributionsPerPage,
  onEdit,
  onDelete,
}: {
  user: User
  onSelect: () => void
  isSelected: boolean
  contributions: Array<any>
  contributionsLoading: boolean
  currentPage: number
  setCurrentPage: (page: number) => void
  contributionsPerPage: number
  onEdit: (contribution: any) => void
  onDelete: (contribution: any) => void
}) {
  const formatDate = (date?: Date) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Pagination for this user's contributions
  const totalPages = Math.ceil(contributions.length / contributionsPerPage)
  const startIndex = (currentPage - 1) * contributionsPerPage
  const paginatedContributions = contributions.slice(
    startIndex,
    startIndex + contributionsPerPage,
  )

  const userTotalContributions = contributions.reduce(
    (sum, c) => sum + c.amount,
    0,
  )

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="p-4 cursor-pointer" onClick={onSelect}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">
              Total Saved: {user.totalSavings.toLocaleString()} FCFA | Last
              Contribution: {formatDate(user.lastContribution)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-indigo-600 text-sm">
              {contributions.length} contributions
            </span>
            <motion.div
              animate={{ rotate: isSelected ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Contribution History
                </h4>
                <span className="text-sm text-gray-600">
                  Total: {userTotalContributions.toLocaleString()} FCFA
                </span>
              </div>

              {contributionsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading contributions...</p>
                </div>
              ) : contributions.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  No contributions found
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-sm font-medium text-gray-600 border-b border-gray-200">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Amount (FCFA)</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContributions.map((contribution, index) => (
                          <motion.tr
                            key={contribution._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-900">
                              {new Date(contribution.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                },
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              {contribution.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                className="text-indigo-600 cursor-pointer hover:text-indigo-800 mr-4 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEdit(contribution)
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 cursor-pointer hover:text-red-800 text-sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDelete(contribution)
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to{' '}
                        {Math.min(
                          startIndex + contributionsPerPage,
                          contributions.length,
                        )}{' '}
                        of {contributions.length} contributions
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentPage(page)
                            }}
                            className={`px-3 py-1 text-sm border rounded-md ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Logo } from '@/assets/images'
import Button from '@/components/ui/Button'
import { useSavings } from '@/hooks/useSavings'

export const Route = createFileRoute('/my-savings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const contributionsPerPage = 10
  const { contributions, totalSavings, isLoading, isError, error } =
    useSavings()

  // Pagination logic
  const totalPages = Math.ceil(contributions.length / contributionsPerPage)
  const startIndex = (currentPage - 1) * contributionsPerPage
  const paginatedContributions = contributions.slice(
    startIndex,
    startIndex + contributionsPerPage,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-4">
      <div className="relative max-w-2xl w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="PocketGrow Logo" className="h-16 w-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          Your Savings Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm font-medium">
          Track your progress with PocketGrow
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading your savings...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-600 font-medium">Failed to load savings</p>
            <p className="text-gray-600 text-sm mt-1">{error?.message}</p>
          </div>
        ) : (
          <>
            {/* Total Savings */}
            <div className="bg-indigo-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Total Savings
              </h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {totalSavings.toLocaleString()} FCFA
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Your accumulated savings from daily contributions
              </p>
            </div>

            {/* Contribution History */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contribution History
                </h2>
                {contributions.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {contributions.length} total contributions
                  </span>
                )}
              </div>

              {contributions.length === 0 ? (
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
                  <p>No contributions yet.</p>
                  <p className="text-sm mt-1">
                    Your contribution history will appear here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-sm font-medium text-gray-600 border-b border-gray-200">
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Amount (FCFA)</th>
                          <th className="py-3 px-4">Contributor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContributions.map((contribution) => (
                          <tr
                            key={contribution._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                            <td className="py-3 px-4 text-gray-600">Admin</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
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
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-3 cursor-pointer py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 cursor-pointer text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Placeholder for Withdrawal Button */}
            <Button
              className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
              disabled
            >
              Request Withdrawal (Coming Soon)
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

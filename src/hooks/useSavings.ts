import { useQuery } from '@tanstack/react-query'

import type { Contribution } from '@/types/contribution.types'

import { getContributions } from '@/services/contribution.service'

export const useSavings = () => {
  const {
    data: contributions = [],
    isLoading,
    isError,
    error,
  } = useQuery<Array<Contribution>, Error>({
    queryKey: ['contributions'],
    queryFn: () => getContributions(),
  })

  console.log('contributtions: ', contributions)

  const totalSavings = contributions.reduce(
    (sum: number, contribution: Contribution) => sum + contribution.amount,
    0,
  )

  return {
    contributions,
    totalSavings,

    isLoading,
    isError,
    error,
  }
}

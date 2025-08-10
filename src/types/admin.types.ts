import z from 'zod'

export const contributionSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  amount: z.number().min(100, 'Minimum contribution is 100 FCFA'),
  date: z.string().min(1, 'Date is required'),
})

export type ContributionFormData = z.infer<typeof contributionSchema>

export interface User {
  _id: string
  name: string
  email: string
  passwordHash: string
  role: 'admin' | 'colleague'
  totalSavings: number
  lastContribution: Date
  createdAt: Date
  updatedAt: Date
}

export interface AdminContribution {
  _id: string
  userId: User
  userName: string
  amount: number
  date: string
  createdAt: string
}

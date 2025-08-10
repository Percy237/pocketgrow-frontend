export interface Contribution {
  _id: string
  userId: string
  amount: number
  date: string
  createdAt: string
  updatedAt: string
}

export interface ContributionsResponse {
  data: Array<Contribution>
  total: number
}

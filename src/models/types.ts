export type Deal = {
  from: string
  to: string
  amount: number
  time: number
  note: string
}

export type Group = {
  name: string
  members: string[]
  balance: Record<string, number>
  deals: Deal[]
}

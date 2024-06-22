import type { UserProfile } from '@auth0/nextjs-auth0/client'

export type User = UserProfile & {
  /** Uid */
  id: string
}

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

export type DetailedGroup = Group & {
  memberProfiles: User[]
}

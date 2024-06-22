import { getSession } from '@auth0/nextjs-auth0'
import { User } from './types'

export async function getUserWithId(id: string) {
  // TODO
}

export async function getUser() {
  const session = await getSession()
  if (session?.user == null) return null
  return {
    ...session.user,
    id: session.user.sub!
  } as User
}

export async function ensureUser() {
  const user = await getUser()
  if (user == null) throw new Error('Login required')
  return user
}

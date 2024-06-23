import { redirect } from 'next/navigation'
import { ManagementClient } from 'auth0'
import { getSession } from '@auth0/nextjs-auth0'
import { User } from '../types'

let _auth0ManagementClient: ManagementClient

function getAuth0ManagementClient() {
  if (_auth0ManagementClient == null) {
    const baseUrl = new URL(process.env.AUTH0_ISSUER_BASE_URL!)
    _auth0ManagementClient = new ManagementClient({
      domain: baseUrl.host,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    })
  }
  return _auth0ManagementClient
}

export async function getUserWithId(id: string): Promise<User> {

  const currentUser = await getCurrentUser()
  if (currentUser?.id === id) return currentUser

  const resp = await getAuth0ManagementClient().users.get({ id /** TODO: fields */ })
  if (resp.status !== 200) throw new Error(`Get user failed: ${resp.status}`)
  const user = resp.data
  return {
    id: user.user_id,
    name: user.name ?? 'Anonymous',
    email: user.email ?? null,
    picture: user.picture ?? null,
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (session?.user == null) return null
  return {
    id: session.user.sub!,
    name: session.user.name ?? 'Anonymous',
    email: session.user.email ?? null,
    picture: session.user.picture ?? null
  }
}

export async function ensureCurrentUser() {
  const user = await getCurrentUser()
  // if (user == null) throw new Error('Login required')
  if (user == null) redirect('/api/auth/login')
  return user
}

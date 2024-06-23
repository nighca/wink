import { useUser } from '@auth0/nextjs-auth0/client'
import { User } from '../types'

export function useCurrentUser() {
  const { user: originalUser, error, isLoading } = useUser()
  const user = originalUser == null ? null : {
    id: originalUser.sub!,
    name: originalUser.name ?? 'Anonymous',
    email: originalUser.email ?? null,
    picture: originalUser.picture ?? null,
  } satisfies User
  return { user, error, isLoading }
}

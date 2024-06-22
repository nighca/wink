'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function UserProfile() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (user == null) return <a href="/api/auth/login">Login</a>

  return (
    user && (
      <div>
        <h2>{user.name}</h2>
        <a href="/api/auth/logout">Logout</a>
      </div>
    )
  )
}

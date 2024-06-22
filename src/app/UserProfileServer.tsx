import { getSession } from '@auth0/nextjs-auth0'

export default async function UserProfileServer() {
  const session = await getSession()
  if (session?.user == null) return 'not login'
  return <h2>{session.user.name}</h2>
}

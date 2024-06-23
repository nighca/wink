import { PropsWithChildren } from 'react'
import { ensureCurrentUser } from '@/models'
import CurrentUserAvatar from '@/components/CurrentUserAvatar'

export default async function WithUser({ children }: PropsWithChildren<{}>) {
  const user = await ensureCurrentUser()
  return (
    <>
      <header className="w-full flex flex-row items-center justify-end gap-2">
        <CurrentUserAvatar user={user} />
      </header>
      {children}
    </>
  )
}

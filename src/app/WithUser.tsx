import { PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function WithUser({ children }: PropsWithChildren<{}>) {
  const session = await getSession()
  if (session?.user == null) redirect('/api/auth/login')
  const user: UserProfile = session.user
  return (
    <>
      <header className="w-full flex flex-row items-center gap-2">
        <Avatar className='shrink-0'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='grow flex flex-col gap-1'>
          <span className='shrink-0'>{user.name}</span>
          <span className='text-xs text-slate-500 truncate'>{user.sub}</span>
        </div>
        <a href="/api/auth/logout" className='text-sm'>Logout</a>
      </header>
      {children}
    </>
  )
}

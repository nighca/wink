import { PropsWithChildren } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from '@/components/UserAvatar'
import { ensureCurrentUser } from '@/models'
import LogoutMenuItem from './LogoutMenuItem'

export default async function WithUser({ children }: PropsWithChildren<{}>) {

  const user = await ensureCurrentUser()

  return (
    <>
      <header className="w-full flex flex-row items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <UserAvatar className='shrink-0' user={user} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='end'>
            <DropdownMenuLabel>
              {user.name}
              <p className='mt-2 text-xs text-slate-500'>ID: {user.id}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LogoutMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      {children}
    </>
  )
}

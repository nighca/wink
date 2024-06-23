'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from '@/components/UserAvatar'
import { User } from '@/models'

export default function CurrentUserAvatar({ user }: { user: User }) {

  function handleUserClick() {
    navigator.clipboard.writeText(user.id)
  }

  function handleLogout() {
    location.assign('/api/auth/logout')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar className='shrink-0' user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuLabel onClick={handleUserClick}>
          {user.name}
          <p className='mt-2 text-xs text-slate-500 max-w-40 truncate'>ID: {user.id}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

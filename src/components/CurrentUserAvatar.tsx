'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/UserAvatar'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/models'

export default function CurrentUserAvatar({ user }: { user: User }) {

  const { toast } = useToast()

  async function copyUserID() {
    try {
      await navigator.clipboard.writeText(user.id)
      toast({ title: 'User ID copied' })
    } catch (e) {
      toast({ title: 'Failed to copy user ID' })
    }
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
        <DropdownMenuItem className='flex flex-col gap-1 items-start' onSelect={copyUserID}>
          <h4>{user.name}</h4>
          <p className='mt-2 text-xs text-slate-500 max-w-40 truncate'>ID: {user.id}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

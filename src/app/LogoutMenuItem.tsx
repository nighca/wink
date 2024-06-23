'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export default function LogoutMenuItem() {
  function handleLogout() {
    location.assign('/api/auth/logout')
  }
  return <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
}

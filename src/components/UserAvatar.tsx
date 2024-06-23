import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/models'

type Props = { user: User } & HTMLAttributes<HTMLSpanElement>

export default function UserAvatar({ user, className, ...rest }: Props) {
  return (
    <Avatar className={cn('shrink-0', className)} {...rest}>
      <AvatarImage src={user.picture ?? undefined} />
      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

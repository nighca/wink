import { ComponentPropsWithoutRef, ElementRef, HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { User } from '@/models'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = { user: User } & HTMLAttributes<HTMLSpanElement>

export default forwardRef<ElementRef<typeof Avatar>, Props>(function UserAvatar({ user, className, ...rest }, ref) {
  return (
    <Avatar className={cn('shrink-0', className)} ref={ref} {...rest}>
      <AvatarImage src={user.picture ?? undefined} />
      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
})

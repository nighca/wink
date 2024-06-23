'use client'

import { useFormStatus } from 'react-dom'
import { createGroup, useCurrentUser } from '@/models'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateGroup() {
  const { user } = useCurrentUser()
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Hi {user?.name}</CardTitle>
        <CardDescription>
          Create a group to start.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" action={createGroup}>
          <FormContent />
        </form>
      </CardContent>
    </Card>
  )
}

function FormContent() {
  const { pending } = useFormStatus()
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" name="name" disabled={pending} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="member">The other member</Label>
        <Input type="text" name="member" disabled={pending} placeholder="Paste user ID of the other member here" required />
      </div>
      <Button type="submit" className="w-full" loading={pending}>
        Create
      </Button>
    </>
  )
}
